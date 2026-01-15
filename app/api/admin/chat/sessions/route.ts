import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        // Check admin authentication
        if (!session || !session.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        // Build filter conditions
        const where: any = {};

        if (status === "needsSupport") {
            where.requestHumanSupport = true;
            where.isActive = true;
        } else if (status === "active") {
            where.isActive = true;
            where.assignedAdminId = { not: null };
        } else if (status === "all") {
            where.isActive = true;
        }

        // Get chat sessions with related data
        const [sessions, total] = await Promise.all([
            prisma.chatSession.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
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
                        orderBy: { timestamp: "desc" },
                        take: 1,
                        select: {
                            content: true,
                            timestamp: true,
                            role: true,
                            sentByAdmin: true,
                        },
                    },
                    _count: {
                        select: {
                            messages: true,
                        },
                    },
                },
                orderBy: {
                    lastMessageAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.chatSession.count({ where }),
        ]);

        // Calculate unread count for each session
        const sessionsWithUnread = await Promise.all(
            sessions.map(async (session) => {
                const unreadCount = await prisma.message.count({
                    where: {
                        sessionId: session.id,
                        isReadByAdmin: false,
                        sentByAdmin: false,
                    },
                });

                return {
                    ...session,
                    unreadCount,
                    lastMessage: session.messages[0] || null,
                };
            })
        );

        return NextResponse.json({
            sessions: sessionsWithUnread,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching chat sessions:", error);
        return NextResponse.json(
            { error: "Failed to fetch chat sessions" },
            { status: 500 }
        );
    }
}
