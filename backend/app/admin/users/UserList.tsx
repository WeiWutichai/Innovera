
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateUserRole } from "./actions";

// Match the Prisma User type loosely
interface User {
    id: number;
    name: string | null;
    email: string;
    image: string | null;
    role: string; // "ADMIN" | "USER"
    createdAt: Date;
}

export default function UserList({ users }: { users: User[] }) {
    const [isPending, startTransition] = useTransition();

    const handleRoleChange = (userId: number, newRole: string) => {
        startTransition(async () => {
            try {
                // Cast to any to assume the server action accepts the enum/string
                await updateUserRole(userId, newRole as any);
            } catch (error) {
                console.error("Failed to update role", error);
                alert("Failed to update role");
            }
        });
    };

    return (
        <div className="bg-[#1e1e1e] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 overflow-hidden">
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name || "User"}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover h-full w-full"
                                                />
                                            ) : (
                                                <span className="font-semibold text-lg">
                                                    {(user.name?.[0] || user.email[0]).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="font-medium text-white">{user.name || "No Name"}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300">{user.email}</td>
                                <td className="px-6 py-4">
                                    <div className="relative inline-block w-32">
                                        <select
                                            disabled={isPending}
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className={`w-full appearance-none bg-[#050505] border border-white/10 text-white py-2 px-3 pr-8 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold uppercase tracking-wider ${user.role === 'ADMIN' ? 'text-indigo-400 border-indigo-500/30' : 'text-gray-400'
                                                }`}
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4" suppressHydrationWarning>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {users.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No users found.
                </div>
            )}
        </div>
    );
}
