import { Suspense } from "react";
import ChatSessionList from "./components/ChatSessionList";

export const dynamic = "force-dynamic";

export default function AdminChatPage() {
    return (
        <div className="font-sans h-[calc(100vh-64px)] overflow-hidden">
            <div className="max-w-7xl mx-auto h-full flex flex-col p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">จัดการแชท</h1>
                    <p className="text-gray-400">
                        ดูและตอบกลับข้อความจากผู้ใช้
                    </p>
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
