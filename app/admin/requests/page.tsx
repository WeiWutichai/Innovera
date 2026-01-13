"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface DemoRequest {
    id: string;
    workEmail: string;
    firstName: string;
    lastName: string;
    companyName: string;
    interest: string;
    status: string;
    createdAt: string;
}

export default function AdminRequestsPage() {
    const { data: session, status } = useSession();
    const [requests, setRequests] = useState<DemoRequest[]>([]);
    const [loading, setLoading] = useState(true);

    if (status === "unauthenticated") {
        redirect("/auth/login?callbackUrl=/admin/requests");
    }

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch("/api/demo-request");
                if (res.ok) {
                    const data = await res.json();
                    setRequests(data);
                }
            } catch (error) {
                console.error("Failed to load requests", error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) {
            fetchRequests();
        }
    }, [session]);

    return (
        <div className="p-8">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Demo Requests</h1>
                    <p className="text-gray-400">View and manage incoming demo requests.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition text-sm font-medium">
                        Refresh
                    </button>
                    <Link href="/admin/users" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition text-sm font-medium">
                        Back to Users
                    </Link>
                </div>
            </header>

            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No demo requests found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Name</th>
                                    <th className="p-4 font-medium">Email</th>
                                    <th className="p-4 font-medium">Company</th>
                                    <th className="p-4 font-medium">Interest</th>
                                    <th className="p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-white/5 transition-colors text-sm text-gray-300">
                                        <td className="p-4 whitespace-nowrap text-gray-400">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-medium text-white">
                                            {req.firstName} {req.lastName}
                                        </td>
                                        <td className="p-4">{req.workEmail}</td>
                                        <td className="p-4">{req.companyName}</td>
                                        <td className="p-4">
                                            <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20">
                                                {req.interest}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs border ${req.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
