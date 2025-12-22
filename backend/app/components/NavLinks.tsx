"use client";
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

interface NavLinksProps {
    mobile?: boolean;
}

export default function NavLinks({ mobile }: NavLinksProps) {
    const { t, language, toggleLanguage } = useLanguage();

    if (mobile) {
        return (
            <nav className="flex flex-col space-y-4">
                <Link href="#insights" className="text-white/70 hover:text-white transition-colors font-nunito text-lg py-2 block">{t.nav.service}</Link>
                <Link href="#platforms" className="text-white/70 hover:text-white transition-colors font-nunito text-lg py-2 block">{t.nav.platforms}</Link>
                <Link href="#site-reference" className="text-white/70 hover:text-white transition-colors font-nunito text-lg py-2 block">{t.nav.siteReference}</Link>
                <Link href="#blog" className="text-white/70 hover:text-white transition-colors font-nunito text-lg py-2 block">{t.nav.blog}</Link>
                <Link href="#contact" className="text-white/70 hover:text-white transition-colors font-nunito text-lg py-2 block">{t.nav.contact}</Link>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-white/70 font-nunito">{language === 'en' ? 'Language' : 'ภาษา'}</span>
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors uppercase"
                    >
                        {language === 'en' ? 'TH' : 'EN'}
                    </button>
                </div>
            </nav>
        );
    }

    return (
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/70 ml-auto mr-6">
            <Link href="#insights" className="hover:text-white transition-colors font-nunito">{t.nav.service}</Link>
            <Link href="#platforms" className="hover:text-white transition-colors font-nunito">{t.nav.platforms}</Link>
            <Link href="#site-reference" className="hover:text-white transition-colors font-nunito">{t.nav.siteReference}</Link>
            <Link href="#blog" className="hover:text-white transition-colors font-nunito">{t.nav.blog}</Link>
            <Link href="#contact" className="hover:text-white transition-colors font-nunito">{t.nav.contact}</Link>

            <button
                onClick={toggleLanguage}
                className="ml-2 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors uppercase"
            >
                {language === 'en' ? 'TH' : 'EN'}
            </button>
        </nav>
    );
}
