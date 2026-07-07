import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare, hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { BCRYPT_ROUNDS } from "@/lib/constants"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { authConfig } from "@/auth.config"

// Precompute a dummy hash once at startup so failed logins for a non-existent
// user take the same time as a real bcrypt comparison (defeats user
// enumeration via timing).
const DUMMY_HASH = hash("invalid-account-timing-equalizer", BCRYPT_ROUNDS)

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        ...authConfig.providers,
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials, request) => {
                const email = credentials?.email as string
                const password = credentials?.password as string

                if (!email || !password) {
                    return null
                }

                // Rate limit by IP + email to slow brute force / credential stuffing.
                const ip = getClientIp(request as Request)
                const rl = rateLimit(`login:${ip}:${email.toLowerCase()}`, 5, 15 * 60 * 1000)
                if (!rl.success) {
                    // Treat as invalid credentials (generic) to avoid leaking the lockout.
                    return null
                }

                let user
                try {
                    user = await prisma.user.findUnique({
                        where: { email },
                    })
                } catch (error) {
                    console.error("Credentials authorize error:", error)
                    return null
                }

                if (!user || !user.password) {
                    // Equalize timing for unknown accounts.
                    await compare(password, await DUMMY_HASH)
                    return null
                }

                const isPasswordValid = await compare(password, user.password)

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                    isApproved: user.isApproved,
                    canReportIssues: user.canReportIssues,
                }
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, account }) {
            // On initial sign-in, resolve the canonical DATABASE user id.
            if (account && user) {
                if (account.provider === "google") {
                    // user.id from Google is the OAuth profile id, NOT our DB id.
                    // Look up the DB row (created in the signIn callback) by email.
                    const dbUser = await prisma.user.findUnique({
                        where: { email: user.email! },
                        select: { id: true },
                    })
                    if (dbUser) token.id = String(dbUser.id)
                } else {
                    // Credentials: user.id is already String(dbUser.id).
                    token.id = user.id
                }
            }

            // On EVERY request, re-read authorization claims from the DB so that
            // role changes, approval, and de-provisioning take effect immediately
            // (the JWT is not a frozen snapshot of privileges). Runs only in the
            // Node runtime; the Edge middleware uses auth.config.ts (no DB).
            if (token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: Number(token.id) },
                    select: { role: true, isApproved: true, canReportIssues: true },
                })
                if (!dbUser) {
                    // User was deleted — invalidate the session.
                    return null
                }
                token.role = dbUser.role
                token.isApproved = dbUser.isApproved
                token.canReportIssues = dbUser.canReportIssues
            }

            return token
        },
        async signIn({ user, account }) {
            // Google: create the DB user on first sign-in (unapproved), then
            // block until an admin approves. This must happen HERE because the
            // jwt callback does not run when signIn returns false.
            if (account?.provider === "google") {
                if (!user?.email) return false

                let dbUser
                try {
                    dbUser = await prisma.user.findUnique({ where: { email: user.email } })
                } catch (error) {
                    console.error("Sign-in approval check error:", error)
                    return false
                }

                if (!dbUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            isApproved: false,
                            accounts: {
                                create: {
                                    type: account.type,
                                    provider: account.provider,
                                    providerAccountId: account.providerAccountId,
                                    access_token: account.access_token,
                                    token_type: account.token_type,
                                    scope: account.scope,
                                    id_token: account.id_token,
                                },
                            },
                        },
                    })
                    // New account — pending approval.
                    return false
                }

                if (dbUser.role === "ADMIN" || dbUser.role === "OWNER") return true
                return dbUser.isApproved
            }

            // Credentials: authorize() already verified the password; enforce
            // the approval gate against the live DB state.
            if (account?.provider === "credentials") {
                if (!user?.email) return false
                let dbUser
                try {
                    dbUser = await prisma.user.findUnique({ where: { email: user.email } })
                } catch (error) {
                    console.error("Sign-in approval check error:", error)
                    return false
                }
                if (!dbUser) return false
                if (dbUser.role === "ADMIN" || dbUser.role === "OWNER") return true
                return dbUser.isApproved
            }

            return true
        },
    },
})
