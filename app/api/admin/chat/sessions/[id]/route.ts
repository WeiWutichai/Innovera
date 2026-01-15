import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        // Check admin authentication
        if (!session || !session.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Get session with all messages
        const chatSession = await prisma.chatSession.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        image: true,
                    },
                },
                assignedAdmin: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                messages: {
                    orderBy: { timestamp: "asc" },
                    include: {
                        feedback: true,
                    },
                },
            },
        });

        if (!chatSession) {
            return NextResponse.json(
                { error: "Chat session not found" },
                { status: 404 }
            );
        }

        // Mark all messages as read by admin
        await prisma.message.updateMany({
            where: {
                sessionId: id,
                isReadByAdmin: false,
                sentByAdmin: false,
            },
            data: {
                isReadByAdmin: true,
            },
        });

        return NextResponse.json(chatSession);
    } catch (error) {
        console.error("Error fetching chat session:", error);
        return NextResponse.json(
            { error: "Failed to fetch chat session" },
            { status: 500 }
        );
    }
}
