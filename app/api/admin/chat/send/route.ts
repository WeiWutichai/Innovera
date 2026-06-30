import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff, authErrorResponse } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
    try {
        // Defense-in-depth: require staff even though middleware guards /api/admin.
        let staff;
        try {
            staff = await requireStaff();
        } catch (e) {
            const r = authErrorResponse(e);
            if (r) return r;
            throw e;
        }

        const body = await request.json();
        const { sessionId, content, assignToMe } = body;

        if (!sessionId || !content) {
            return NextResponse.json(
                { error: "Session ID and content are required" },
                { status: 400 }
            );
        }

        // Verify session exists
        const chatSession = await prisma.chatSession.findUnique({
            where: { id: sessionId },
        });

        if (!chatSession) {
            return NextResponse.json(
                { error: "Chat session not found" },
                { status: 404 }
            );
        }

        // Create admin message
        const message = await prisma.message.create({
            data: {
                sessionId,
                role: "assistant",
                content,
                sentByAdmin: true,
                isReadByAdmin: true,
            },
        });

        // Update session - mark that admin took over
        const updateData: any = {
            lastMessageAt: new Date(),
            adminTookOver: true, // Admin is now handling conversation
            lastAdminReplyAt: new Date(), // Track when admin last replied
        };

        if (assignToMe && staff.id) {
            updateData.assignedAdminId = parseInt(staff.id);
        }

        await prisma.chatSession.update({
            where: { id: sessionId },
            data: updateData,
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("Error sending admin message:", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
