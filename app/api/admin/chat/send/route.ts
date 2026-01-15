import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        // Check admin authentication
        if (!session || !session.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
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

        // Update session
        const updateData: any = {
            lastMessageAt: new Date(),
        };

        if (assignToMe && session.user.id) {
            updateData.assignedAdminId = parseInt(session.user.id as string);
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
            {
                error: "Failed to send message",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}
