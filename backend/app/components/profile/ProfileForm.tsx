"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function ProfileForm({ user }: { user: any }) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/user/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update password");
            }

            setMessage("Password updated successfully");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white mb-4 font-nunito">Profile Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1 font-nunito">Full Name</label>
                        <div className="text-white font-medium font-nunito">{user.name || "N/A"}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/60 mb-1 font-nunito">Email Address</label>
                        <div className="text-white font-medium font-nunito">{user.email}</div>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white mb-4 font-nunito">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {message && <div className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm">{message}</div>}
                    {error && <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1 font-nunito">Current Password</label>
                        <input
                            type="password"
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1 font-nunito">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1 font-nunito">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-10 px-6 rounded-lg bg-white text-black font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-nunito"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium font-nunito"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
