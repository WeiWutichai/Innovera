"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User as UserIcon } from "lucide-react";

interface Message {
    id: string;
    role: string;
    content: string;
    timestamp: Date;
    sentByAdmin: boolean;
}

interface ChatSession {
    id: string;
    messages: Message[];
    user: { id: number; email: string; name: string | null; image: string | null } | null;
    guestId: string | null;
    assignedAdminId: number | null;
}

export default function AdminChatInterface({ session }: { session: ChatSession }) {
    const [messages, setMessages] = useState<Message[]>(session.messages);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Poll for new messages every 3 seconds
    useEffect(() => {
        const pollMessages = async () => {
            try {
                const response = await fetch(`/api/admin/chat/sessions/${session.id}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.messages) {
                        // Always update messages to catch read status changes
                        setMessages(data.messages);

                        // Mark user messages as read when new messages arrive
                        if (data.messages.length > messages.length) {
                            fetch("/api/admin/chat/mark-read", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ sessionId: session.id }),
                            }).catch(err => console.error("Failed to mark as read:", err));
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to poll messages:", error);
            }
        };

        // Poll immediately
        pollMessages();

        // Then poll every 1 second for faster read receipt updates
        const interval = setInterval(pollMessages, 1000);

        return () => clearInterval(interval);
    }, [session.id]);

    const handleSend = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const response = await fetch("/api/admin/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: session.id,
                    content: newMessage.trim(),
                    assignToMe: !session.assignedAdminId,
                }),
            });

            if (response.ok) {
                const message = await response.json();
                setMessages([...messages, message]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col" style={{ height: "calc(100vh - 300px)" }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.sentByAdmin ? "justify-end" : "justify-start"}`}
                    >
                        {!message.sentByAdmin && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                {message.role === "user" ? (
                                    <UserIcon className="w-4 h-4 text-primary" />
                                ) : (
                                    <Bot className="w-4 h-4 text-cyan-400" />
                                )}
                            </div>
                        )}
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${message.sentByAdmin
                                ? "bg-primary text-white"
                                : message.role === "user"
                                    ? "bg-white/10 text-white"
                                    : "bg-cyan-500/10 text-cyan-100 border border-cyan-500/20"
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 flex items-center gap-1 ${message.sentByAdmin ? "text-white/70" : "text-gray-400"}`}>
                                {new Date(message.timestamp).toLocaleTimeString("th-TH")}
                                {message.sentByAdmin && (
                                    <span className="ml-1">
                                        {(message as any).isReadByUser ? "✓✓" : "✓"}
                                    </span>
                                )}
                            </p>
                        </div>
                        {message.sentByAdmin && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-primary" />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
                <div className="flex gap-2">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="พิมพ์ข้อความ..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
                        rows={2}
                        disabled={sending}
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending || !newMessage.trim()}
                        className="px-6 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        ส่ง
                    </button>
                </div>
                {!session.assignedAdminId && (
                    <p className="text-xs text-gray-400 mt-2">
                        💡 การส่งข้อความครั้งแรกจะกำหนดให้คุณเป็นผู้ดูแลแชทนี้โดยอัตโนมัติ
                    </p>
                )}
            </div>
        </div>
    );
}
