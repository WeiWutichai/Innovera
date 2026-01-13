"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NavLinks from './NavLinks';
import ProfileMenu from './ProfileMenu';
import LanguageSelector from './LanguageSelector';

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
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white shadow-md ${scrolled ? "py-2" : "py-4"}`}
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-extrabold text-secondary flex items-center gap-2 tracking-tight group hover:scale-105 transition-transform duration-300">
                        <span className="font-sans uppercase hover:drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-300">INNOVERA</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <NavLinks />

                        {/* Actions */}
                        <div className="flex items-center gap-4 ml-4">
                            {user ? (
                                <ProfileMenu user={user} />
                            ) : (
                                <>

                                    <Link
                                        href="#contact"
                                        className="bg-primary text-white px-6 py-3 rounded hover:bg-primary-hover transition font-bold shadow-md text-sm font-sans uppercase tracking-wide"
                                    >
                                        Contact Us
                                    </Link>
                                </>
                            )}

                            {/* Language Selector (Far Right) */}
                            <div className="border-l border-gray-200 pl-4 ml-2">
                                <LanguageSelector />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-secondary focus:outline-none text-2xl"
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
                <div className="md:hidden mt-4 pb-4 border-t border-gray-100 bg-white px-6 py-4 shadow-xl">
                    <NavLinks mobile />
                    <div className="mt-6 flex flex-col gap-3">
                        {user ? (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                                <span className="text-sm text-secondary font-bold">{user.name || user.email}</span>
                            </div>

                        ) : (
                            <>

                                <Link href="#contact" className="block w-full text-center bg-primary text-white font-bold py-3 rounded shadow-md hover:bg-primary-hover transition uppercase text-sm">
                                    CONTACT US
                                </Link>
                            </>
                        )}

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-gray-500 font-bold text-sm">Language</span>
                            <LanguageSelector />
                        </div>
                    </div>
                </div>
            )
            }
        </header >
    );
}
