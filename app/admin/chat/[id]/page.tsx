import { prisma } from "@/lib/prisma";
import AdminChatInterface from "../components/AdminChatInterface";
import { notFound } from "next/navigation";
import { MessageCircle, Clock, User } from "lucide-react";

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
            <div className="max-w-6xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                แชทกับ {session.user?.name || session.user?.email || `Guest ${session.guestId?.slice(0, 8)}`}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    เริ่มเมื่อ: {new Date(session.startedAt).toLocaleString("th-TH")}
                                </span>
                                {session.requestHumanSupport && (
                                    <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-medium border border-amber-100">
                                        ต้องการความช่วยเหลือ
                                    </span>
                                )}
                                {session.assignedAdmin && (
                                    <span className="flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" />
                                        ดูแลโดย: {session.assignedAdmin.name || session.assignedAdmin.email}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Interface */}
                <AdminChatInterface session={session} />
            </div>
        </div>
    );
}
