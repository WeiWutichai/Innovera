"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    sentByAdmin?: boolean;
    isReadByAdmin?: boolean;
}

interface ChatContextType {
    messages: Message[];
    isOpen: boolean;
    isLoading: boolean;
    sessionId: string | null;
    guestId: string | null;
    humanSupportRequested: boolean;
    adminAssigned: boolean;
    captchaVerified: boolean;
    captchaLoading: boolean;
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
    const [captchaVerified, setCaptchaVerified] = useState(true); // Default true - CAPTCHA is optional
    const [captchaLoading, setCaptchaLoading] = useState(false);

    // Load reCAPTCHA script
    useEffect(() => {
        const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
        if (!siteKey) {
            console.warn("reCAPTCHA site key not configured - chat will work without CAPTCHA");
            // captchaVerified is already true by default
            return;
        }

        // CAPTCHA is configured, set to false until verified
        setCaptchaVerified(false);

        // Check if script already loaded
        if (document.querySelector('script[src*="recaptcha"]')) {
            return;
        }

        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;

        script.onload = () => {
            console.log("reCAPTCHA script loaded successfully");
        };

        script.onerror = () => {
            console.error("Failed to load reCAPTCHA script");
            setCaptchaVerified(true); // Allow chat if script fails to load
        };

        document.head.appendChild(script);

        return () => {
            try {
                if (script.parentNode) {
                    document.head.removeChild(script);
                }
            } catch (e) {
                // Ignore cleanup errors
            }
        };
    }, []);

    // Verify CAPTCHA when chat opens
    useEffect(() => {
        if (!isOpen || captchaVerified || captchaLoading) return;

        const verifyCaptcha = async () => {
            const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
            if (!siteKey) {
                setCaptchaVerified(true);
                return;
            }

            setCaptchaLoading(true);

            // Set timeout fallback - allow chat after 5 seconds even if CAPTCHA fails
            const timeoutId = setTimeout(() => {
                console.warn("CAPTCHA verification timeout - allowing chat anyway");
                setCaptchaVerified(true);
                setCaptchaLoading(false);
            }, 5000);

            try {
                // Wait for reCAPTCHA to be ready (max 3 seconds)
                const readyPromise = new Promise((resolve, reject) => {
                    const checkReady = setInterval(() => {
                        if (typeof window.grecaptcha !== 'undefined' && typeof window.grecaptcha.ready === 'function') {
                            clearInterval(checkReady);
                            resolve(true);
                        }
                    }, 100);

                    // Timeout after 3 seconds
                    setTimeout(() => {
                        clearInterval(checkReady);
                        reject(new Error("reCAPTCHA script load timeout"));
                    }, 3000);
                });

                await readyPromise;

                // Execute reCAPTCHA
                window.grecaptcha.ready(async () => {
                    try {
                        const token = await window.grecaptcha.execute(siteKey, {
                            action: "chat_open",
                        });

                        // Verify token with backend
                        const response = await fetch("/api/chat/verify-captcha", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ token }),
                        });

                        const data = await response.json();

                        clearTimeout(timeoutId);

                        if (data.success) {
                            console.log("CAPTCHA verified, score:", data.score);
                            setCaptchaVerified(true);
                        } else {
                            console.warn("CAPTCHA verification failed:", data.error);
                            // Allow chat anyway on failure
                            setCaptchaVerified(true);
                        }
                    } catch (error) {
                        console.error("CAPTCHA execution error:", error);
                        clearTimeout(timeoutId);
                        setCaptchaVerified(true); // Allow chat on error
                    } finally {
                        setCaptchaLoading(false);
                    }
                });
            } catch (error) {
                console.error("CAPTCHA error:", error);
                clearTimeout(timeoutId);
                setCaptchaLoading(false);
                setCaptchaVerified(true); // Allow chat on error
            }
        };

        verifyCaptcha();
    }, [isOpen, captchaVerified, captchaLoading]);

    // Initialize session
    useEffect(() => {
        if (!captchaVerified) return; // Wait for CAPTCHA verification
        const initSession = async () => {
            // Check for existing session in localStorage
            const storedSessionId = localStorage.getItem("chatSessionId");
            const storedGuestId = localStorage.getItem("chatGuestId");

            if (storedSessionId) {
                setSessionId(storedSessionId);
                setGuestId(storedGuestId);

                // Load history
                try {
                    const response = await fetch(`/api/chat/history/${storedSessionId}?guestId=${storedGuestId || ''}`);
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

    // Poll for new messages when chat is open
    useEffect(() => {
        if (!sessionId || !isOpen) return;

        const pollMessages = async () => {
            try {
                const response = await fetch(`/api/chat/history/${sessionId}?guestId=${guestId || ''}`);
                const data = await response.json();

                if (data.success) {
                    const newMessages = data.data.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                    }));

                    // Always update messages to catch read status changes
                    setMessages(newMessages);

                    // Mark admin messages as read when new messages arrive
                    if (newMessages.length > messages.length) {
                        fetch("/api/chat/mark-read", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ sessionId }),
                        }).catch(err => console.error("Failed to mark as read:", err));
                    }

                    // Check if admin is assigned
                    if (data.data.session?.assignedAdminId) {
                        setAdminAssigned(true);
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
    }, [sessionId, isOpen]);

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
                captchaVerified,
                captchaLoading,
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
