import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff, authErrorResponse } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
    try {
        try {
            await requireStaff();
        } catch (e) {
            const r = authErrorResponse(e);
            if (r) return r;
            throw e;
        }

        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        // Mark all messages in this session as read by admin
        await prisma.message.updateMany({
            where: {
                sessionId,
                sentByAdmin: false,
                isReadByAdmin: false,
            },
            data: {
                isReadByAdmin: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Mark as read error:", error);
        return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
    }
}
