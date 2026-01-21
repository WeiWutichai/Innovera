"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { RefreshCw, ChevronLeft, ClipboardList } from "lucide-react";

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
        <div>
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Demo Requests</h1>
                    <p className="text-gray-500">View and manage incoming demo requests.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.location.reload()} className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition text-sm font-medium flex items-center gap-2 shadow-sm">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <Link href="/admin/users" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition text-sm font-medium flex items-center gap-2 shadow-sm">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Users
                    </Link>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="p-12 text-center">
                        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No demo requests found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-5">Date</th>
                                    <th className="p-5">Name</th>
                                    <th className="p-5">Email</th>
                                    <th className="p-5">Company</th>
                                    <th className="p-5">Interest</th>
                                    <th className="p-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors text-sm">
                                        <td className="p-5 whitespace-nowrap text-gray-500">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 font-medium text-gray-900">
                                            {req.firstName} {req.lastName}
                                        </td>
                                        <td className="p-5 text-gray-600">{req.workEmail}</td>
                                        <td className="p-5 text-gray-600">{req.companyName}</td>
                                        <td className="p-5">
                                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-medium border border-indigo-100">
                                                {req.interest}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${req.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
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
