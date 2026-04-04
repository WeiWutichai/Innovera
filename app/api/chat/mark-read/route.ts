import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    try {
        const { sessionId, guestId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        // Verify ownership
        const chatSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
        if (!chatSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        const authSession = await auth();
        const isAdmin = authSession?.user && (authSession.user as any).role === 'ADMIN';

        if (!isAdmin && chatSession.guestId && guestId !== chatSession.guestId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Mark all admin messages in this session as read by user
        await prisma.message.updateMany({
            where: {
                sessionId,
                sentByAdmin: true,
                isReadByUser: false,
            },
            data: {
                isReadByUser: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mark as read error:", error);
        return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
    }
}
