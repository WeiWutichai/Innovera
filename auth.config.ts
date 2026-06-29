import type { NextAuthConfig } from "next-auth"
import type { Role } from "@prisma/client"
import Google from "next-auth/providers/google"

/**
 * Edge-safe auth configuration shared between the Node runtime (auth.ts) and
 * the Edge middleware. It must NOT import Prisma, bcrypt, or anything that
 * relies on the Node runtime, because the middleware bundle runs on the Edge.
 *
 * The Credentials provider, the `jwt` callback (DB-backed claim refresh) and
 * the `signIn` callback live in auth.ts and are merged on top of this.
 */
export const authConfig = {
    session: {
        strategy: "jwt" as const,
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        // Pure (no DB) — safe to run on the Edge. Reads the claims that the
        // Node `jwt` callback encoded into the token.
        session({ session, token }) {
            if (token?.id) {
                session.user.id = String(token.id)
                session.user.role = token.role as Role
                session.user.isApproved = token.isApproved as boolean
                session.user.canReportIssues = token.canReportIssues as boolean
            }
            return session
        },
    },
} satisfies NextAuthConfig
