import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/auth.config"

// Edge-safe auth instance (no Prisma/bcrypt) for middleware gating only.
const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { pathname } = req.nextUrl

    // --- Admin gate (ADMIN/OWNER only) ---
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

    // --- Content Security Policy ---
    // This app has statically prerendered pages, so per-request nonces cannot be
    // applied reliably to the prerendered Next.js script tags. Keep the policy
    // compatible with static output while still avoiding unsafe-eval.
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data: https://fonts.gstatic.com",
        "connect-src 'self' https://innovera.co.th https://www.google.com",
        "media-src 'self' blob: data:",
        "object-src 'none'",
        "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://www.google.com",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self'",
    ].join("; ")

    const response = NextResponse.next()
    response.headers.set("Content-Security-Policy", csp)
    return response
})

export const config = {
    matcher: [
        // Run on all routes EXCEPT Next internals and static asset files.
        // Covers pages and API routes (so the admin gate above still applies).
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|woff|woff2|ttf|otf|mp4)$).*)",
    ],
}
