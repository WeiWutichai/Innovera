"use client";

import React from "react";
import { useChat } from "@/app/context/ChatContext";
import { getQuickReplies } from "@/lib/gemini";

export default function QuickReplies() {
    const { sendMessage, isLoading } = useChat();
    const quickReplies = getQuickReplies("th");

    const handleQuickReply = (reply: string) => {
        if (!isLoading) {
            sendMessage(reply);
        }
    };

    return (
        <div className="px-4 pb-4 space-y-2">
            <p className="text-xs text-gray-500 font-medium">💡 คำถามที่ถามบ่อย:</p>
            <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        disabled={isLoading}
                        className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {reply}
                    </button>
                ))}
            </div>
        </div>
    );
}
