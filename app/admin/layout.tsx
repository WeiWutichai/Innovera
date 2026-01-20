import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import NotificationBell from "./components/NotificationBell";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Check if user is authenticated and has ADMIN role
    if (!session || !session.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <section className="min-h-screen bg-[#141D2F]">
            <AdminSidebar />
            <div className="pl-64 transition-all duration-300">
                {/* Admin Header */}
                <header className="h-16 bg-[#141D2F] border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-white">Admin Dashboard</h2>
                    </div>
                    <NotificationBell />
                </header>

                {/* Main Content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </section>
    );
}
