import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff, authErrorResponse } from "@/lib/auth-helpers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Defense-in-depth: require staff even though middleware guards /api/admin.
        try {
            await requireStaff();
        } catch (e) {
            const r = authErrorResponse(e);
            if (r) return r;
            throw e;
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
