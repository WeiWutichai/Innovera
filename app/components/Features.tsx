"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Features() {
    const { t } = useLanguage();

    return (
        <>
            {/* Cards Section */}
            <section id="platforms" className="mt-4 md:mt-8 scroll-mt-24">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Card 1 */}
                    <article className="group relative rounded-3xl overflow-hidden bg-stone-900 h-80 shadow-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-white/30">
                        <div className="absolute inset-0 bg-[url('/assets/inno-one-composite.png')] bg-cover bg-center"></div>
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <img src="/assets/inno-one-mobile-1.png" alt="Mobile interface 1" className="w-16 h-auto rounded-lg shadow-lg border border-white/20 -rotate-3" />
                            <img src="/assets/inno-one-mobile-2.png" alt="Mobile interface 2" className="w-16 h-auto rounded-lg shadow-lg border border-white/20 rotate-3" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                        <div className="absolute bottom-0 left-0 right-0 pt-6 pr-6 pb-6 pl-6">
                            <h3 className="text-white text-xl md:text-2xl leading-snug tracking-tight mb-1 font-nunito font-semibold">
                                {t.features.cards.purpose.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 font-nunito">{t.features.cards.purpose.desc}</p>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/15 text-white/90 transition group-hover:bg-white/10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </div>
                    </article>

                    {/* Card 2 */}
                    <article className="group relative rounded-3xl overflow-hidden bg-stone-900 h-80 shadow-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-white/30">
                        <div className="absolute inset-0 bg-[url('/assets/lawfirm-dashboard-new.png')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white text-xl md:text-2xl leading-snug tracking-tight mb-1 font-nunito font-semibold">
                                {t.features.cards.speed.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 font-nunito">{t.features.cards.speed.desc}</p>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/15 text-white/90 transition group-hover:bg-white/10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </div>
                    </article>

                    {/* Card 3 */}
                    <article className="group relative rounded-3xl overflow-hidden bg-stone-900 h-80 shadow-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-white/30">
                        <div className="absolute inset-0 bg-[url('/assets/physical-therapy-dashboard.png')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white text-xl md:text-2xl leading-snug tracking-tight mb-1 font-nunito font-semibold">
                                {t.features.cards.craft.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 font-nunito">{t.features.cards.craft.desc}</p>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/15 text-white/90 transition group-hover:bg-white/10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </div>
                    </article>

                    {/* Card 4 (Collaboration) */}
                    <article className="group relative rounded-3xl overflow-hidden bg-stone-900 h-80 shadow-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-white/30">
                        <div className="absolute inset-0 bg-[url('/assets/dormitory-dashboard.png')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white text-xl md:text-2xl leading-snug tracking-tight mb-1 font-nunito font-semibold">
                                {t.features.cards.collaboration.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 font-nunito">{t.features.cards.collaboration.desc}</p>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/15 text-white/90 transition group-hover:bg-white/10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </div>
                    </article>

                    {/* Card 5 (Integration) */}
                    <article className="group relative rounded-3xl overflow-hidden bg-stone-900 h-80 shadow-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-white/30">
                        <div className="absolute inset-0 bg-[url('/assets/hr-dashboard-v3.png')] bg-cover bg-center"></div>
                        <div className="absolute inset-0 bg-black/50"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white text-xl md:text-2xl leading-snug tracking-tight mb-1 font-nunito font-semibold">
                                {t.features.cards.integration.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 font-nunito">{t.features.cards.integration.desc}</p>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/15 text-white/90 transition group-hover:bg-white/10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </div>
                    </article>

                    {/* Card 6 (Security) */}
                    <article className="group relative rounded-3xl overflow-hidden bg-stone-900 h-80 shadow-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-white/30">
                        <div className="absolute inset-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/61b8e1b5-22b1-4280-8ced-ed3ee0678a32_1600w.jpg)] bg-cover"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white text-xl md:text-2xl leading-snug tracking-tight mb-1 font-nunito font-semibold">
                                {t.features.cards.security.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 font-nunito">{t.features.cards.security.desc}</p>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/15 text-white/90 transition group-hover:bg-white/10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </span>
                        </div>
                    </article>
                </div>
            </section>

            {/* Feature Highlights */}

        </>
    );
}
