"use client";
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

interface NavLinksProps {
    mobile?: boolean;
}

export default function NavLinks({ mobile }: NavLinksProps) {
    const { t, language, toggleLanguage } = useLanguage();

    const linkClass = "text-gray-600 hover:text-primary transition uppercase font-sans font-semibold text-sm tracking-wide";
    const mobileLinkClass = "block text-gray-700 font-bold hover:text-primary py-2 uppercase";

    if (mobile) {
        return (
            <nav className="flex flex-col space-y-2">
                <Link href="/#services" className={mobileLinkClass}>{t.nav.service}</Link>
                <Link href="/#platforms" className={mobileLinkClass}>{t.nav.platforms}</Link>
                <Link href="/#site-reference" className={mobileLinkClass}>{t.nav.siteReference}</Link>
                <Link href="/blog" className={mobileLinkClass}>{t.nav.blog}</Link>
                <Link href="/#customers" className={mobileLinkClass}>{t.nav.pricing}</Link>


            </nav>
        );
    }

    return (
        <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#services" className={linkClass}>{t.nav.service}</Link>
            <Link href="/#platforms" className={linkClass}>{t.nav.platforms}</Link>
            <Link href="/#site-reference" className={linkClass}>{t.nav.siteReference}</Link>
            <Link href="/blog" className={linkClass}>{t.nav.blog}</Link>
            <Link href="/#customers" className={linkClass}>{t.nav.pricing}</Link>

        </nav>
    );
}
