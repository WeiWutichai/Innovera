"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

interface NotificationData {
    unreadCount: number;
    supportRequestCount: number;
    recentUnreadSessions: Array<{
        id: string;
        user: { id: number; email: string; name: string | null } | null;
        guestId: string | null;
        lastMessage: { content: string; timestamp: Date } | null;
        requestHumanSupport: boolean;
    }>;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<NotificationData>({
        unreadCount: 0,
        supportRequestCount: 0,
        recentUnreadSessions: [],
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/chat/notifications");
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const totalNotifications = notifications.unreadCount + notifications.supportRequestCount;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {totalNotifications > 99 ? "99+" : totalNotifications}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-secondary border border-white/10 rounded-lg shadow-2xl z-20 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/10">
                            <h3 className="text-sm font-semibold text-white">การแจ้งเตือน</h3>
                            {notifications.supportRequestCount > 0 && (
                                <p className="text-xs text-red-400 mt-1">
                                    {notifications.supportRequestCount} แชทต้องการความช่วยเหลือ
                                </p>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                    กำลังโหลด...
                                </div>
                            ) : notifications.recentUnreadSessions.length === 0 ? (
                                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                    ไม่มีการแจ้งเตือน
                                </div>
                            ) : (
                                notifications.recentUnreadSessions.map((session) => (
                                    <Link
                                        key={session.id}
                                        href={`/admin/chat/${session.id}`}
                                        onClick={() => setShowDropdown(false)}
                                        className="block px-4 py-3 hover:bg-white/5 border-b border-white/5 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {session.user?.name || session.user?.email || `Guest ${session.guestId?.slice(0, 8)}`}
                                                </p>
                                                {session.lastMessage && (
                                                    <p className="text-xs text-gray-400 truncate mt-1">
                                                        {session.lastMessage.content}
                                                    </p>
                                                )}
                                            </div>
                                            {session.requestHumanSupport && (
                                                <span className="flex-shrink-0 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                                                    ต้องการช่วยเหลือ
                                                </span>
                                            )}
                                        </div>
                                        {session.lastMessage && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(session.lastMessage.timestamp).toLocaleString("th-TH")}
                                            </p>
                                        )}
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.recentUnreadSessions.length > 0 && (
                            <div className="px-4 py-2 border-t border-white/10">
                                <Link
                                    href="/admin/chat"
                                    onClick={() => setShowDropdown(false)}
                                    className="text-xs text-primary hover:text-primary/80 font-medium"
                                >
                                    ดูทั้งหมด →
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
