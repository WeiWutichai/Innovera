import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Basic role check
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
        redirect("/");
    }

    return (
        <section className="min-h-screen bg-secondary">
            <AdminSidebar />
            <main className="pl-64 transition-all duration-300">
                {children}
            </main>
        </section>
    );
}
