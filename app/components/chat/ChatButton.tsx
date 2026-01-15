"use client";

import React from "react";
import { useChat } from "@/app/context/ChatContext";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatButton() {
    const { isOpen, toggleChat, messages } = useChat();

    // Count unread messages (simple implementation)
    const unreadCount = 0; // Can be enhanced later

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleChat}
                        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-primary to-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-primary/50 transition-shadow duration-300"
                        aria-label="Open chat"
                    >
                        <MessageCircle className="w-7 h-7" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
