import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { compare } from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
                    } else {
                        token.role = existingUser.role
                    }
                } else {
                    token.role = user.role
                }
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = String(token.id)
                session.user.role = token.role
            }
            return session
        },
    },
})
