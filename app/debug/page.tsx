"use client";

import { useChat } from "@/app/context/ChatContext";

export default function DebugPage() {
    const chat = useChat();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Chat Debug Info</h1>

            <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded">
                    <h2 className="font-bold">Chat State:</h2>
                    <pre className="mt-2 text-sm">
                        {JSON.stringify({
                            isOpen: chat.isOpen,
                            isLoading: chat.isLoading,
                            sessionId: chat.sessionId,
                            guestId: chat.guestId,
                            captchaVerified: chat.captchaVerified,
                            captchaLoading: chat.captchaLoading,
                            messagesCount: chat.messages.length,
                        }, null, 2)}
                    </pre>
                </div>

                <div className="p-4 bg-gray-100 rounded">
                    <h2 className="font-bold">Environment:</h2>
                    <pre className="mt-2 text-sm">
                        RECAPTCHA_SITE_KEY: {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "NOT SET"}
                    </pre>
                </div>

                <div className="space-x-2">
                    <button
                        onClick={chat.openChat}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Open Chat
                    </button>
                    <button
                        onClick={chat.closeChat}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Close Chat
                    </button>
                </div>

                <div className="p-4 bg-gray-100 rounded">
                    <h2 className="font-bold">Messages:</h2>
                    <div className="mt-2 space-y-2">
                        {chat.messages.map((msg) => (
                            <div key={msg.id} className="text-sm">
                                <strong>{msg.role}:</strong> {msg.content.substring(0, 50)}...
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
