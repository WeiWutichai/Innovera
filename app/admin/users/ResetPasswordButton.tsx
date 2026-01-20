"use client";

import { useState, useTransition } from "react";
import { resetUserPassword } from "./actions";

interface Props {
    userId: number;
    userEmail: string;
}

export default function ResetPasswordButton({ userId, userEmail }: Props) {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const openModal = () => {
        setIsOpen(true);
        setNewPassword("");
        setError("");
        setSuccess(false);
    };

    const closeModal = () => {
        setIsOpen(false);
        setNewPassword("");
        setError("");
        setSuccess(false);
    };

    const handleReset = () => {
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        startTransition(async () => {
            try {
                await resetUserPassword(userId, newPassword);
                setSuccess(true);
                setError("");
                setTimeout(() => {
                    closeModal();
                }, 1500);
            } catch (err: any) {
                setError(err.message || "Failed to reset password");
            }
        });
    };

    return (
        <>
            <button
                onClick={openModal}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg transition flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Reset Password
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1e1e1e] w-full max-w-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
                            <h2 className="text-lg font-bold">Reset Password</h2>
                            <button onClick={closeModal} className="text-white/60 hover:text-white transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {success ? (
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
                                        Resetting password for: <strong className="text-white">{userEmail}</strong>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-400 text-sm rounded">
                                            {error}
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
                                            onClick={closeModal}
                                            className="flex-1 px-4 py-2 border border-white/10 text-gray-400 font-bold rounded-lg hover:bg-white/5 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReset}
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
