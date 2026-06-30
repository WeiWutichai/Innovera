import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isStaff } from "@/lib/auth-helpers";

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

        // Authorization. Staff (ADMIN/OWNER) may mark any session. Otherwise the
        // caller must prove ownership of the session.
        const authSession = await auth();
        if (!isStaff(authSession?.user?.role)) {
            if (chatSession.userId !== null) {
                // Owned by a logged-in user: require a matching authenticated id.
                if (!authSession?.user?.id) {
                    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                }
                if (Number(authSession.user.id) !== chatSession.userId) {
                    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
                }
            } else if (chatSession.guestId) {
                // Anonymous session: require the matching guestId from the body.
                if (!guestId || guestId !== chatSession.guestId) {
                    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                }
            } else {
                // Orphan session with no known owner: deny for non-staff.
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
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
