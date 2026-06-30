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

    // --- Per-request CSP with a nonce ---
    // 'strict-dynamic' lets scripts loaded by the nonced bundle run (covers
    // Next's chunks and the runtime-injected reCAPTCHA loader) WITHOUT
    // 'unsafe-inline'/'unsafe-eval'. `https:` is a fallback for older browsers
    // that ignore strict-dynamic. Next.js reads the nonce from the request
    // header and applies it to its own inline scripts automatically.
    const nonce = btoa(crypto.randomUUID())
    const csp = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`,
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

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set("x-nonce", nonce)
    requestHeaders.set("Content-Security-Policy", csp)

    const response = NextResponse.next({ request: { headers: requestHeaders } })
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
