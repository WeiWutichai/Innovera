import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        const session = await auth()

        if (!session || !session.user || session.user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
    ]
}
