import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateGuestId } from "@/lib/chatUtils";
import { auth } from "@/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
    try {
        // Rate limit session creation to curb automated abuse / table flooding.
        if (!rateLimit(`chat-session:${getClientIp(request)}`, 30, 60_000).success) {
            return NextResponse.json(
                { success: false, error: "Too many requests. Please slow down." },
                { status: 429 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const guestId = body?.guestId;

        // Validate the optional guestId.
        if (
            guestId !== undefined &&
            guestId !== null &&
            (typeof guestId !== "string" || guestId.length > 100)
        ) {
            return NextResponse.json(
                { success: false, error: "Invalid guestId" },
                { status: 400 }
            );
        }

        // Identity is derived from the session, NEVER trusted from the body. A
        // logged-in caller binds to their user id; the body cannot set an
        // arbitrary userId.
        const authSession = await auth();
        const authUserId = authSession?.user?.id ? Number(authSession.user.id) : null;

        // Generate session ID
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create new chat session bound to the caller's identity.
        const session = await prisma.chatSession.create({
            data: {
                id: sessionId,
                userId: authUserId,
                guestId: authUserId ? null : (guestId || generateGuestId()),
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                sessionId: session.id,
                guestId: session.guestId,
                startedAt: session.startedAt,
            },
        });
    } catch (error) {
        console.error("Session creation error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create session" },
            { status: 500 }
        );
    }
}
