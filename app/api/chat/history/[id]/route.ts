import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isStaff } from "@/lib/auth-helpers";

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

        // Authorization. Staff (ADMIN/OWNER) may read any session. Otherwise the
        // caller must prove ownership of the session.
        const authSession = await auth();

        if (!isStaff(authSession?.user?.role)) {
            if (session.userId !== null) {
                // Session is owned by a logged-in user: require an authenticated
                // session whose user id matches the owner.
                if (!authSession?.user?.id) {
                    return NextResponse.json(
                        { success: false, error: "Unauthorized" },
                        { status: 401 }
                    );
                }
                if (Number(authSession.user.id) !== session.userId) {
                    return NextResponse.json(
                        { success: false, error: "Forbidden" },
                        { status: 403 }
                    );
                }
            } else if (session.guestId) {
                // Anonymous session: require the matching guestId query param.
                const guestId = request.nextUrl.searchParams.get("guestId");
                if (!guestId || guestId !== session.guestId) {
                    return NextResponse.json(
                        { success: false, error: "Unauthorized" },
                        { status: 401 }
                    );
                }
            } else {
                // Orphan session with no known owner: deny for non-staff.
                return NextResponse.json(
                    { success: false, error: "Unauthorized" },
                    { status: 401 }
                );
            }
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
