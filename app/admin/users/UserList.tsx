
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { updateUserRole, resetUserPassword } from "./actions";

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
    const [resetModal, setResetModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
    const [newPassword, setNewPassword] = useState("");
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);

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

    const openResetModal = (user: User) => {
        setResetModal({ open: true, user });
        setNewPassword("");
        setResetError("");
        setResetSuccess(false);
    };

    const closeResetModal = () => {
        setResetModal({ open: false, user: null });
        setNewPassword("");
        setResetError("");
        setResetSuccess(false);
    };

    const handleResetPassword = () => {
        if (!resetModal.user) return;
        if (newPassword.length < 6) {
            setResetError("Password must be at least 6 characters");
            return;
        }

        startTransition(async () => {
            try {
                await resetUserPassword(resetModal.user!.id, newPassword);
                setResetSuccess(true);
                setResetError("");
                setTimeout(() => {
                    closeResetModal();
                }, 1500);
            } catch (error: any) {
                setResetError(error.message || "Failed to reset password");
            }
        });
    };

    return (
        <>
            <div className="bg-[#1e1e1e] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Actions</th>
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
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => openResetModal(user)}
                                            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded transition"
                                        >
                                            Reset Password
                                        </button>
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

            {/* Reset Password Modal */}
            {resetModal.open && resetModal.user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1e1e1e] w-full max-w-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
                            <h2 className="text-lg font-bold">Reset Password</h2>
                            <button onClick={closeResetModal} className="text-white/60 hover:text-white transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {resetSuccess ? (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-green-400 font-bold">Password Reset Successfully!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-gray-300 text-sm">
                                        Resetting password for: <strong className="text-white">{resetModal.user.email}</strong>
                                    </div>

                                    {resetError && (
                                        <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-400 text-sm rounded">
                                            {resetError}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password (min 6 characters)"
                                            className="w-full bg-[#050505] border border-white/10 text-white py-2 px-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={closeResetModal}
                                            className="flex-1 px-4 py-2 border border-white/10 text-gray-400 font-bold rounded-lg hover:bg-white/5 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleResetPassword}
                                            disabled={isPending || newPassword.length < 6}
                                            className="flex-1 bg-orange-600 text-white py-2 px-4 font-bold rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                                        >
                                            {isPending ? "Resetting..." : "Reset Password"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
