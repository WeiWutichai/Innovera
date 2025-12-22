"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from './NavLinks';
import ProfileMenu from './ProfileMenu';

interface NavbarContentProps {
    user: any; // Using any for simplicity with the auth session type, or proper type if available
}

export default function NavbarContent({ user }: NavbarContentProps) {
    const [scrolled, setScrolled] = useState(false);

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
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
                    ? "backdrop-blur-md bg-[#050505]/80 border-b border-white/10 shadow-lg"
                    : "bg-transparent border-b border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="inline-flex items-center gap-2">
                        <span className="text-sm sm:text-base font-medium tracking-tight font-nunito text-white">Innovera</span>
                    </Link>

                    {/* Nav */}
                    <NavLinks />

                    {/* Actions */}
                    <div className="flex items-center gap-2">
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
                </div>
            </div>
        </header>
    );
}
