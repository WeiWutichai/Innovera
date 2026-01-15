"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    sentByAdmin?: boolean;
}

interface ChatContextType {
    messages: Message[];
    isOpen: boolean;
    isLoading: boolean;
    sessionId: string | null;
    guestId: string | null;
    humanSupportRequested: boolean;
    adminAssigned: boolean;
    sendMessage: (message: string) => Promise<void>;
    requestHumanSupport: () => Promise<void>;
    toggleChat: () => void;
    openChat: () => void;
    closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [guestId, setGuestId] = useState<string | null>(null);
    const [humanSupportRequested, setHumanSupportRequested] = useState(false);
    const [adminAssigned, setAdminAssigned] = useState(false);

    // Initialize session
    useEffect(() => {
        const initSession = async () => {
            // Check for existing session in localStorage
            const storedSessionId = localStorage.getItem("chatSessionId");
            const storedGuestId = localStorage.getItem("chatGuestId");

            if (storedSessionId) {
                setSessionId(storedSessionId);
                setGuestId(storedGuestId);

                // Load history
                try {
                    const response = await fetch(`/api/chat/history/${storedSessionId}`);
                    const data = await response.json();

                    if (data.success) {
                        setMessages(
                            data.data.messages.map((msg: any) => ({
                                ...msg,
                                timestamp: new Date(msg.timestamp),
                            }))
                        );
                    }
                } catch (error) {
                    console.error("Failed to load history:", error);
                }
            } else {
                // Create new session
                try {
                    const response = await fetch("/api/chat/session", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({}),
                    });

                    const data = await response.json();

                    if (data.success) {
                        setSessionId(data.data.sessionId);
                        setGuestId(data.data.guestId);
                        localStorage.setItem("chatSessionId", data.data.sessionId);
                        localStorage.setItem("chatGuestId", data.data.guestId);

                        // Add welcome message
                        setMessages([
                            {
                                id: "welcome",
                                role: "assistant",
                                content: "สวัสดีครับ! 👋 ผมคือ AI Assistant ของ Innovera มีอะไรให้ช่วยไหมครับ?",
                                timestamp: new Date(),
                            },
                        ]);
                    }
                } catch (error) {
                    console.error("Failed to create session:", error);
                }
            }
        };

        initSession();
    }, []);

    const sendMessage = async (message: string) => {
        if (!sessionId || !message.trim()) return;

        const userMessage: Message = {
            id: `temp_${Date.now()}`,
            role: "user",
            content: message,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    message,
                    guestId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update user message with real ID
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === userMessage.id
                            ? { ...msg, id: data.data.userMessage.id }
                            : msg
                    )
                );

                // Add assistant message if present
                if (data.data.assistantMessage) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: data.data.assistantMessage.id,
                            role: "assistant",
                            content: data.data.assistantMessage.content,
                            timestamp: new Date(data.data.assistantMessage.timestamp),
                            sentByAdmin: false,
                        },
                    ]);
                }
            } else {
                // Show error message
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `error_${Date.now()}`,
                        role: "assistant",
                        content: "ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
                        timestamp: new Date(),
                    },
                ]);
            }
        } catch (error) {
            console.error("Send message error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: `error_${Date.now()}`,
                    role: "assistant",
                    content: "ขออภัยครับ ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const requestHumanSupport = async () => {
        if (!sessionId || humanSupportRequested) return;

        try {
            const response = await fetch("/api/chat/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    message: "ฉันต้องการความช่วยเหลือจากเจ้าหน้าที่",
                    guestId,
                    requestHumanSupport: true,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setHumanSupportRequested(true);
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `system_${Date.now()}`,
                        role: "assistant",
                        content: "เจ้าหน้าที่ได้รับการแจ้งเตือนแล้ว กรุณารอสักครู่ค่ะ 🙏",
                        timestamp: new Date(),
                    },
                ]);
            }
        } catch (error) {
            console.error("Failed to request human support:", error);
        }
    };

    const toggleChat = () => setIsOpen((prev) => !prev);
    const openChat = () => setIsOpen(true);
    const closeChat = () => setIsOpen(false);

    return (
        <ChatContext.Provider
            value={{
                messages,
                isOpen,
                isLoading,
                sessionId,
                guestId,
                humanSupportRequested,
                adminAssigned,
                sendMessage,
                requestHumanSupport,
                toggleChat,
                openChat,
                closeChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within ChatProvider");
    }
    return context;
}
