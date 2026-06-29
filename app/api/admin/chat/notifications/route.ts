import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff, authErrorResponse } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
    try {
        // Defense-in-depth: require staff even though middleware guards /api/admin.
        try {
            await requireStaff();
        } catch (e) {
            const r = authErrorResponse(e);
            if (r) return r;
            throw e;
        }

        // Get unread message count
        const unreadCount = await prisma.message.count({
            where: {
                isReadByAdmin: false,
                sentByAdmin: false,
            },
        });

        // Get sessions requesting human support
        const supportRequestCount = await prisma.chatSession.count({
            where: {
                requestHumanSupport: true,
                isActive: true,
            },
        });

        // Get recent unread sessions (last 5)
        const recentUnreadSessions = await prisma.chatSession.findMany({
            where: {
                messages: {
                    some: {
                        isReadByAdmin: false,
                        sentByAdmin: false,
                    },
                },
                isActive: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                messages: {
                    where: {
                        isReadByAdmin: false,
                        sentByAdmin: false,
                    },
                    orderBy: {
                        timestamp: "desc",
                    },
                    take: 1,
                    select: {
                        content: true,
                        timestamp: true,
                    },
                },
            },
            orderBy: {
                lastMessageAt: "desc",
            },
            take: 5,
        });

        return NextResponse.json({
            unreadCount,
            supportRequestCount,
            recentUnreadSessions: recentUnreadSessions.map((session) => ({
                id: session.id,
                user: session.user,
                guestId: session.guestId,
                lastMessage: session.messages[0] || null,
                requestHumanSupport: session.requestHumanSupport,
            })),
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}
