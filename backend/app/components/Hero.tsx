"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
    const { t } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-transparent min-h-screen flex items-center justify-center">

            <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-pink-500/10 blur-3xl rounded-full pointer-events-none z-0"></div>
            <div className="absolute -bottom-48 -right-40 w-[520px] h-[520px] bg-pink-500/10 blur-3xl rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 lg:col-start-1 flex flex-col justify-center py-20 lg:py-0">
                    <div className="inline-flex gap-2 w-max text-xs text-white/80 bg-white/5 border-white/10 border rounded-full mb-4 px-2.5 py-1 backdrop-blur-lg items-center font-nunito">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-red-400"></span>
                        {t.hero.badge}
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight font-nunito font-semibold text-white">
                        {t.hero.title}
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed font-nunito max-w-2xl">
                        {t.hero.description}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <a href="#" className="inline-flex items-center justify-center h-11 hover:bg-white/90 transition text-sm font-medium text-stone-900 bg-white rounded-xl px-4 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] font-nunito">
                            {t.hero.createWorkspace}
                            <svg width="18" height="18" viewBox="0 0 24 24" className="ml-1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 5v14"></path>
                                <path d="M5 12h14"></path>
                            </svg>
                        </a>
                        <a href="#" className="inline-flex items-center justify-center h-11 hover:text-white hover:border-white/20 transition text-sm text-white/90 border-white/10 border rounded-xl px-4 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] backdrop-blur-lg font-nunito">
                            {t.hero.bookDemo}
                            <svg width="18" height="18" viewBox="0 0 24 24" className="ml-1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                        </a>
                    </div>

                    <div className="mt-6 flex items-center gap-4 text-xs text-white/60">
                        <div className="flex -space-x-2">
                            <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/bcaefeee-31cd-4c69-9a33-39ee0ad78c30_320w.jpg" alt="Customer avatar" className="h-6 w-6 rounded-full ring-2 ring-stone-950 object-cover" />
                            <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/9c3af2bd-32da-4659-8095-1deb5455b9f6_800w.jpg" alt="Customer avatar" className="h-6 w-6 rounded-full ring-2 ring-stone-950 object-cover" />
                            <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4d72eb51-d86e-431b-ad62-97cdf574a592_320w.jpg" alt="Customer avatar" className="h-6 w-6 rounded-full ring-2 ring-stone-950 object-cover" />
                        </div>
                        <span className="font-nunito">{t.hero.trustedBy}</span>
                    </div>
                </div>

                {/* Hero visual */}

            </div>
        </section>
    );
}
