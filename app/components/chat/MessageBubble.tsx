"use client";

import React from "react";
import { motion } from "framer-motion";
import { formatTimestamp } from "@/lib/chatUtils";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    sentByAdmin?: boolean;
    isReadByAdmin?: boolean;
}

interface MessageBubbleProps {
    message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";
    const isAdmin = message.sentByAdmin === true;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div className={`flex gap-2 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
                    ? "bg-blue-500"
                    : isAdmin
                        ? "bg-green-500"
                        : "bg-gradient-to-r from-primary to-orange-600"
                    }`}>
                    <span className="text-white text-sm">
                        {isUser ? "👤" : isAdmin ? "👨‍💼" : "🤖"}
                    </span>
                </div>

                {/* Message Content */}
                <div className="flex flex-col gap-1">
                    <div
                        className={`px-4 py-3 rounded-2xl ${isUser
                            ? "bg-blue-500 text-white rounded-tr-sm"
                            : isAdmin
                                ? "bg-green-50 text-gray-800 rounded-tl-sm shadow-sm border border-green-200"
                                : "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100"
                            }`}
                    >
                        {isAdmin && (
                            <p className="text-xs text-green-600 font-semibold mb-1">เจ้าหน้าที่</p>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <span className={`text-xs text-gray-400 px-2 flex items-center gap-1 ${isUser ? "justify-end" : "justify-start"}`}>
                        {formatTimestamp(message.timestamp)}
                        {isUser && (
                            <span className="ml-1">
                                {message.isReadByAdmin ? "✓✓" : "✓"}
                            </span>
                        )}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
