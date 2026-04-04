import NextAuth from "next-auth"
import { Role } from "@prisma/client"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const email = credentials?.email as string
                const password = credentials?.password as string

                if (!email || !password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user || !user.password) {
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
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                // Persist the OAuth access_token to the token right after signin
                // Save user to database if google login
                if (account.provider === 'google') {
                    const existingUser = await prisma.user.findUnique({ where: { email: user.email! } })
                    if (!existingUser) {
                        await prisma.user.create({
                            data: {
                                email: user.email!,
                                name: user.name,
                                image: user.image,
                                accounts: {
                                    create: {
                                        type: account.type,
                                        provider: account.provider,
                                        providerAccountId: account.providerAccountId,
                                        access_token: account.access_token,
                                        token_type: account.token_type,
                                        scope: account.scope,
                                        id_token: account.id_token
                                    }
                                }
                            }
                        })
                        token.role = "USER"
                        token.isApproved = false
                        token.canReportIssues = false
                    } else {
                        token.role = existingUser.role
                        token.isApproved = existingUser.isApproved
                        token.canReportIssues = existingUser.canReportIssues
                    }
                } else {
                    token.role = user.role
                    token.isApproved = user.isApproved
                    token.canReportIssues = user.canReportIssues
                }

                // Block sign in if not approved (except for existing Google users who might be auto-approved or handled differently? 
                // For now, let's enforce approval for everyone newly logging in or existing users)
                // Actually, if we return false/throw error here, it might be better?
                // But signIn callback is where we usually block.
                // Let's use the `signIn` callback for blocking.
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = String(token.id)
                session.user.role = token.role as Role
                session.user.isApproved = token.isApproved as boolean
                session.user.canReportIssues = token.canReportIssues as boolean
            }
            return session
        },
        async signIn({ user, account }) {
            if (!user?.email) return true;

            // Fetch user from DB to check approval status
            const dbUser = await prisma.user.findUnique({ where: { email: user.email } });

            if (account?.provider === 'google' && !dbUser) {
                // New Google user — will be created in jwt callback with isApproved: false
                // Block sign-in until admin approves
                return false;
            }

            if (dbUser) {
                // Allow admins always; block unapproved users
                if (dbUser.role === 'ADMIN' || dbUser.role === 'OWNER') return true;
                if (!dbUser.isApproved) return false;
            }

            return true;
        }
    },
})
