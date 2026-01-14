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

    // Check if user is authenticated and has ADMIN role
    if (!session || !session.user || session.user.role !== "ADMIN") {
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
