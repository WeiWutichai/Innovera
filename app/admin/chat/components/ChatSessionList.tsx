"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, User, Clock, Inbox } from "lucide-react";

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

    const fetchSessions = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const response = await fetch(`/api/admin/chat/sessions?status=${filter}`);
            if (response.ok) {
                const data = await response.json();
                setSessions(data.sessions);
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();

        // Poll for updates every 5 seconds (silent refresh)
        const interval = setInterval(() => {
            fetchSessions(true);
        }, 5000);

        return () => clearInterval(interval);
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
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === "all"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                        : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    ทั้งหมด
                </button>
                <button
                    onClick={() => setFilter("needsSupport")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === "needsSupport"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                        : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    ต้องการความช่วยเหลือ
                </button>
                <button
                    onClick={() => setFilter("active")}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === "active"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                        : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    กำลังดำเนินการ
                </button>
            </div>

            {/* Session List */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-lg">
                    <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">ไม่มีแชทในหมวดนี้</p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {sessions.map((session) => (
                        <Link
                            key={session.id}
                            href={`/admin/chat/${session.id}`}
                            className="block bg-white hover:bg-gray-50 border border-gray-200 hover:border-indigo-200 rounded-xl p-5 transition-all shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4">
                                {/* User Info */}
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                                        <User className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-gray-900 font-semibold truncate">
                                                {session.user?.name ||
                                                    session.user?.email ||
                                                    `Guest ${session.guestId?.slice(0, 8)}`}
                                            </h3>
                                            {session.unreadCount > 0 && (
                                                <span className="flex-shrink-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                    {session.unreadCount}
                                                </span>
                                            )}
                                            {session.requestHumanSupport && (
                                                <span className="flex-shrink-0 bg-amber-50 text-amber-600 text-xs px-2 py-0.5 rounded-lg font-medium border border-amber-100">
                                                    ต้องการช่วยเหลือ
                                                </span>
                                            )}
                                        </div>
                                        {session.lastMessage && (
                                            <p className="text-sm text-gray-500 truncate">
                                                {session.lastMessage.sentByAdmin && "คุณ: "}
                                                {session.lastMessage.content}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
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
                                    <div className="flex-shrink-0 text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">
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
