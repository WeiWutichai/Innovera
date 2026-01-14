"use client";
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

import Robot from './Robot';
import VideoModal from './VideoModal';

export default function Hero() {
    const { t } = useLanguage();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    useEffect(() => {
        const reveal = () => {
            var reveals = document.querySelectorAll(".reveal");
            for (var i = 0; i < reveals.length; i++) {
                var windowHeight = window.innerHeight;
                var elementTop = reveals[i].getBoundingClientRect().top;
                var elementVisible = 150;
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add("active");
                }
            }
        };
        window.addEventListener("scroll", reveal);
        reveal(); // Trigger once on load
        return () => window.removeEventListener("scroll", reveal);
    }, []);

    return (
        <header className="relative pt-32 pb-32 lg:pt-48 lg:pb-48 overflow-hidden bg-secondary text-white min-h-[90vh] flex items-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="white" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                <div className="lg:w-1/2 reveal active flex flex-col items-start text-left">
                    <div className="inline-block px-3 py-1 bg-gray-700/50 border border-gray-600 rounded text-xs font-bold tracking-widest uppercase mb-6 text-orange-400">
                        Process Intelligence & Automation
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 font-sans">
                        {t.hero.title} <br /><span className="text-primary">{t.hero.titleHighlight}</span>
                    </h1>
                    <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed font-thai">
                        {t.hero.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/request-demo" className="bg-primary text-white px-8 py-4 rounded font-bold hover:bg-primary-hover transition shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm font-sans">
                            REQUEST DEMO
                        </Link>
                        <button
                            onClick={() => setIsVideoModalOpen(true)}
                            className="bg-transparent border border-white text-white px-8 py-4 rounded font-bold hover:bg-white hover:text-secondary transition flex items-center justify-center gap-2 uppercase tracking-wide text-sm font-sans"
                        >
                            WATCH VIDEO
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path d="M5 3l14 9-14 9V3z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                    <Robot />
                </div>
            </div>

            {/* Wave Shape Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
                <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                </svg>
            </div>

            {/* Video Modal */}
            <VideoModal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                videoUrl="/videos/innovera-company.mp4"
            />
        </header>
    );
}
