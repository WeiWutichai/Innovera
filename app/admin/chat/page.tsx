import { Suspense } from "react";
import ChatSessionList from "./components/ChatSessionList";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminChatPage() {
    return (
        <div className="font-sans h-[calc(100vh-64px)] overflow-hidden">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">จัดการแชท</h1>
                            <p className="text-gray-500 text-sm">
                                ดูและตอบกลับข้อความจากผู้ใช้
                            </p>
                        </div>
                    </div>
                </div>

                <Suspense fallback={
                    <div className="text-center py-12 text-gray-400">
                        กำลังโหลด...
                    </div>
                }>
                    <ChatSessionList />
                </Suspense>
            </div>
        </div>
    );
}
