import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await prisma.chatSession.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: { timestamp: "asc" },
                },
            },
        });

        if (!session) {
            return NextResponse.json(
                { success: false, error: "Session not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                sessionId: session.id,
                session: {
                    assignedAdminId: session.assignedAdminId,
                },
                messages: session.messages.map((msg) => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    timestamp: msg.timestamp,
                    sentByAdmin: msg.sentByAdmin,
                    isReadByAdmin: msg.isReadByAdmin,
                    isReadByUser: msg.isReadByUser,
                })),
            },
        });
    } catch (error) {
        console.error("History fetch error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch history" },
            { status: 500 }
        );
    }
}
