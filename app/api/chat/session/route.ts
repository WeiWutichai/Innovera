import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateGuestId } from "@/lib/chatUtils";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, guestId } = body;

        // Generate session ID
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create new chat session
        const session = await prisma.chatSession.create({
            data: {
                id: sessionId,
                userId: userId ? parseInt(userId) : null,
                guestId: guestId || generateGuestId(),
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
