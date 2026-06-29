import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/auth.config"

// Edge-safe auth instance (no Prisma/bcrypt) for middleware gating only.
const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { pathname } = req.nextUrl

    // Protect admin page routes and admin API routes. Both ADMIN and OWNER are
    // staff; everyone else is rejected.
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        const role = req.auth?.user?.role
        const isStaff = role === "ADMIN" || role === "OWNER"

        if (!isStaff) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 })
            }
            return NextResponse.redirect(new URL("/", req.nextUrl))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/admin/:path*",
    ],
}
