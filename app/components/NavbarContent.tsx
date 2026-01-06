"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from './NavLinks';
import ProfileMenu from './ProfileMenu';
import Logo from './Logo';

interface NavbarContentProps {
    user: any; // Using any for simplicity with the auth session type, or proper type if available
}

export default function NavbarContent({ user }: NavbarContentProps) {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen
                ? "backdrop-blur-md bg-[#050505]/95 border-b border-white/10 shadow-lg"
                : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <Logo className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-lg font-bold tracking-tight font-nunito text-white">Innovera</span>
                    </Link>

                    {/* Desktop Nav */}
                    <NavLinks />

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <ProfileMenu user={user} />
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:inline-flex items-center h-9 px-3 rounded-lg border border-white/10 text-sm text-white/80 hover:text-white hover:border-white/20 transition-colors font-nunito">
                                    Sign in
                                </Link>
                                <Link href="/register" className="inline-flex items-center h-9 px-3 rounded-lg bg-white text-stone-900 text-sm font-medium hover:bg-white/90 transition-colors font-nunito">
                                    Start free
                                    <svg width="18" height="18" viewBox="0 0 24 24" className="ml-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-white/80 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/10 bg-[#050505] px-6 py-4 h-screen">
                    <NavLinks mobile />
                    <div className="mt-6 flex flex-col gap-3">
                        {user ? (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                                <span className="text-sm text-white">{user.name || user.email}</span>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="flex items-center justify-center h-10 px-4 rounded-lg border border-white/10 text-sm text-white/80 hover:text-white hover:border-white/20 transition-colors font-nunito w-full">
                                    Sign in
                                </Link>
                                <Link href="/register" className="flex items-center justify-center h-10 px-4 rounded-lg bg-white text-stone-900 text-sm font-medium hover:bg-white/90 transition-colors font-nunito w-full">
                                    Start free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
