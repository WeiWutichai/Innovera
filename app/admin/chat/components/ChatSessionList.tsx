"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, User, Clock } from "lucide-react";

interface ChatSession {
    id: string;
    userId: number | null;
    guestId: string | null;
    requestHumanSupport: boolean;
    assignedAdminId: number | null;
    lastMessageAt: Date | null;
    user: { id: number; email: string; name: string | null } | null;
    assignedAdmin: { id: number; email: string; name: string | null } | null;
    lastMessage: { content: string; timestamp: Date; role: string; sentByAdmin: boolean } | null;
    unreadCount: number;
    _count: { messages: number };
}

export default function ChatSessionList() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "needsSupport" | "active">("all");

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/chat/sessions?status=${filter}`);
            if (response.ok) {
                const data = await response.json();
                setSessions(data.sessions);
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [filter]);

    const formatTimestamp = (date: Date | null) => {
        if (!date) return "ไม่มีข้อความ";
        const now = new Date();
        const messageDate = new Date(date);
        const diffMs = now.getTime() - messageDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "เมื่อสักครู่";
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
        return messageDate.toLocaleDateString("th-TH");
    };

    return (
        <div>
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                >
                    ทั้งหมด
                </button>
                <button
                    onClick={() => setFilter("needsSupport")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "needsSupport"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                >
                    ต้องการความช่วยเหลือ
                </button>
                <button
                    onClick={() => setFilter("active")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "active"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                >
                    กำลังดำเนินการ
                </button>
            </div>

            {/* Session List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    ไม่มีแชทในหมวดนี้
                </div>
            ) : (
                <div className="grid gap-4">
                    {sessions.map((session) => (
                        <Link
                            key={session.id}
                            href={`/admin/chat/${session.id}`}
                            className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* User Info */}
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-white font-medium truncate">
                                                {session.user?.name ||
                                                    session.user?.email ||
                                                    `Guest ${session.guestId?.slice(0, 8)}`}
                                            </h3>
                                            {session.unreadCount > 0 && (
                                                <span className="flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                    {session.unreadCount}
                                                </span>
                                            )}
                                            {session.requestHumanSupport && (
                                                <span className="flex-shrink-0 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded">
                                                    ต้องการช่วยเหลือ
                                                </span>
                                            )}
                                        </div>
                                        {session.lastMessage && (
                                            <p className="text-sm text-gray-400 truncate">
                                                {session.lastMessage.sentByAdmin && "คุณ: "}
                                                {session.lastMessage.content}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatTimestamp(session.lastMessageAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-3 h-3" />
                                                {session._count.messages} ข้อความ
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Assigned Admin */}
                                {session.assignedAdmin && (
                                    <div className="flex-shrink-0 text-xs text-gray-400">
                                        ดูแลโดย: {session.assignedAdmin.name || session.assignedAdmin.email}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
