"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

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
    // Tracks that a verification attempt has already run so a failed (fail-closed)
    // attempt does not retry in a loop when captchaLoading flips back to false.
    const [captchaAttempted, setCaptchaAttempted] = useState(false);

    // Always-current snapshot of messages so polling can compare lengths
    // without re-creating the interval on every new message.
    const messagesRef = useRef<Message[]>([]);
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

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
            // Fail closed: do not mark CAPTCHA as verified if the script cannot load.
            console.error("Failed to load reCAPTCHA script");
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

    // Verify CAPTCHA when chat opens. Fails CLOSED: if verification cannot
    // complete or is rejected, captchaVerified stays false and sending stays
    // blocked. captchaAttempted prevents a retry loop once an attempt finishes.
    useEffect(() => {
        if (!isOpen || captchaVerified || captchaLoading || captchaAttempted) return;

        const verifyCaptcha = async () => {
            const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
            if (!siteKey) {
                // CAPTCHA not configured: treat as verified (feature is optional).
                setCaptchaVerified(true);
                return;
            }

            setCaptchaAttempted(true);
            setCaptchaLoading(true);

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

                        if (data.success) {
                            console.log("CAPTCHA verified, score:", data.score);
                            setCaptchaVerified(true);
                        } else {
                            // Fail closed: do not allow sending when verification fails.
                            console.warn("CAPTCHA verification failed:", data.error);
                        }
                    } catch (error) {
                        // Fail closed.
                        console.error("CAPTCHA execution error:", error);
                    } finally {
                        setCaptchaLoading(false);
                    }
                });
            } catch (error) {
                // Fail closed.
                console.error("CAPTCHA error:", error);
                setCaptchaLoading(false);
            }
        };

        verifyCaptcha();
    }, [isOpen, captchaVerified, captchaLoading, captchaAttempted]);

    // Initialize session (only after CAPTCHA passes, and only once).
    useEffect(() => {
        if (!captchaVerified || sessionId) return; // Wait for CAPTCHA; don't re-init
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
    }, [captchaVerified, sessionId]);

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

                    // Mark admin messages as read when new messages arrive.
                    // Compare against the live ref to avoid a stale closure.
                    if (newMessages.length > messagesRef.current.length) {
                        fetch("/api/chat/mark-read", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ sessionId, guestId }),
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
    }, [sessionId, isOpen, guestId]);

    const sendMessage = async (message: string) => {
        if (!sessionId || !message.trim()) return;
        // Fail closed: never send unless CAPTCHA verification succeeded.
        if (!captchaVerified) return;

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
        // Fail closed: never send unless CAPTCHA verification succeeded.
        if (!captchaVerified) return;

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
