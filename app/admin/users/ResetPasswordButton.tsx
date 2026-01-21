"use client";

import { useState, useTransition } from "react";
import { resetUserPassword } from "./actions";
import { Key, X, CheckCircle2, AlertCircle } from "lucide-react";

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
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center gap-2 active:scale-95"
            >
                <Key className="w-4 h-4" />
                Reset Password
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                    <Key className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-xl font-bold">Reset Password</h2>
                            </div>
                            <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            {success ? (
                                <div className="text-center py-6 animate-in zoom-in duration-300">
                                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600 shadow-inner">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <p className="text-green-600 text-xl font-bold">Success!</p>
                                    <p className="text-gray-500 mt-1">Password has been updated.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">User Email</div>
                                        <div className="text-gray-900 font-bold">{userEmail}</div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
                                            <AlertCircle className="w-5 h-5" />
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Min 6 characters"
                                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 py-3 px-4 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={closeModal}
                                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReset}
                                            disabled={isPending || newPassword.length < 6}
                                            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:shadow-none active:scale-95"
                                        >
                                            {isPending ? "Resetting..." : "Update Password"}
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
