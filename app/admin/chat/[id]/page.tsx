import { prisma } from "@/lib/prisma";
import AdminChatInterface from "../components/AdminChatInterface";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChatDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await prisma.chatSession.findUnique({
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
            },
        },
    });

    if (!session) {
        notFound();
    }

    // Mark messages as read
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

    return (
        <div className="font-sans h-[calc(100vh-64px)] overflow-hidden">
            <div className="max-w-6xl mx-auto h-full flex flex-col p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        แชทกับ {session.user?.name || session.user?.email || `Guest ${session.guestId?.slice(0, 8)}`}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>เริ่มเมื่อ: {new Date(session.startedAt).toLocaleString("th-TH")}</span>
                        {session.requestHumanSupport && (
                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                                ต้องการความช่วยเหลือ
                            </span>
                        )}
                        {session.assignedAdmin && (
                            <span>
                                ดูแลโดย: {session.assignedAdmin.name || session.assignedAdmin.email}
                            </span>
                        )}
                    </div>
                </div>

                {/* Chat Interface */}
                <AdminChatInterface session={session} />
            </div>
        </div>
    );
}
