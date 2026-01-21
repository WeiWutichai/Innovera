"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from '../context/LanguageContext';

type User = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | any;
};

interface ProfileMenuProps {
    user: User;
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { t } = useLanguage();

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
    };

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getInitials = (name?: string | null, email?: string | null) => {
        return name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || "U";
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 overflow-hidden"
                aria-label="Open profile menu"
            >
                {user.image ? (
                    <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-sm font-bold text-indigo-300">
                        {getInitials(user.name, user.email)}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#1e1e1e] border border-white/10 shadow-2xl py-4 z-50 text-white font-nunito animation-fade-in origin-top-right">
                    {/* Header / User Info */}
                    <div className="px-6 flex flex-col items-center gap-3 mb-4 text-center">
                        <div className="h-20 w-20 rounded-full flex items-center justify-center text-3xl font-medium border border-indigo-500/30 bg-indigo-500/20 text-indigo-300 relative">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || "User avatar"}
                                    width={80}
                                    height={80}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                getInitials(user.name, user.email)
                            )}
                            {/* Camera icon overlay - purely decorative for now to match UI */}
                            <div className="absolute bottom-0 right-0 bg-[#303134] p-1.5 rounded-full border border-[#1e1e1e]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                            </div>
                        </div>
                        <div>
                            <div className="text-base font-semibold text-white/90">{t.profileMenu.hi}, {user.name || "User"}!</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                        <Link
                            href="/profile"
                            className="mt-1 px-5 py-2 rounded-full border border-gray-600 text-sm font-medium text-blue-300 hover:bg-white/5 transition-colors"
                        >
                            {t.profileMenu.manage}
                        </Link>
                        {user.role === 'ADMIN' && (
                            <Link
                                href="/admin/users"
                                className="mt-1 px-5 py-2 rounded-full border border-gray-600 text-sm font-medium text-blue-300 hover:bg-white/5 transition-colors"
                            >
                                Manage your admin portal
                            </Link>
                        )}
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 flex items-center justify-center gap-2 hover:bg-white/5 transition-colors rounded-b-2xl text-sm font-medium text-gray-300 border-t border-white/10"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        {t.profileMenu.signOut}
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                        <Link href="#" className="hover:text-gray-300">{t.profileMenu.privacy}</Link>
                        <span>•</span>
                        <Link href="#" className="hover:text-gray-300">{t.profileMenu.terms}</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
