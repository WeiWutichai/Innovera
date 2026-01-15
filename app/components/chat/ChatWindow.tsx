"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useChat } from "@/app/context/ChatContext";
import { X, Minimize2, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import QuickReplies from "./QuickReplies";

export default function ChatWindow() {
    const { isOpen, closeChat, messages, humanSupportRequested, adminAssigned, requestHumanSupport } = useChat();
    const [isMinimized, setIsMinimized] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    const chatContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.3, type: "spring", damping: 25 }}
                    className="fixed bottom-6 right-6 z-[99999] w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
                    style={{ position: 'fixed', zIndex: 99999 }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-orange-600 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                🤖
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">น้องอินโน</h3>
                                <p className="text-xs text-white/80">
                                    {adminAssigned
                                        ? "เจ้าหน้าที่กำลังตอบ 👤"
                                        : humanSupportRequested
                                            ? "กำลังรอเจ้าหน้าที่... ⏳"
                                            : "Online • ตอบกลับทันที"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!humanSupportRequested && !adminAssigned && (
                                <button
                                    onClick={requestHumanSupport}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    aria-label="Contact Staff"
                                    title="ติดต่อเจ้าหน้าที่"
                                >
                                    <UserPlus className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                aria-label="Minimize"
                            >
                                <Minimize2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={closeChat}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    {!isMinimized && (
                        <>
                            <MessageList />
                            {messages.length <= 1 && <QuickReplies />}
                            <ChatInput />
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(chatContent, document.body);
}
