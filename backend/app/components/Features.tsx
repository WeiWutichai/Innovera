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
                    <article className="group relative rounded-3xl overflow-hidden bg-stone-900 h-80 shadow-xl border border-white/10">
                        <div className="absolute inset-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/61b8e1b5-22b1-4280-8ced-ed3ee0678a32_1600w.jpg)] bg-cover"></div>
                        <div className="absolute bottom-0 left-0 right-0 pt-6 pr-6 pb-6 pl-6">
                            <h3 className="text-white text-xl md:text-2xl leading-snug tracking-tight mb-1 font-nunito font-semibold">
                                {t.features.cards.purpose.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 font-nunito">{t.features.cards.purpose.desc}</p>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/15 text-white/90 transition group-hover:bg-white/10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 5v14"></path>
                                    <path d="M5 12h14"></path>
                                </svg>
                            </span>
                        </div>
                    </article>

                    {/* Card 2 */}
                    <article className="group relative rounded-3xl overflow-hidden bg-stone-900 h-80 shadow-xl border border-white/10">
                        <div className="absolute inset-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/78877756-9e45-410e-b630-78c3dfb8e94c_1600w.jpg)] bg-cover"></div>
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
                    <article className="group relative rounded-3xl overflow-hidden bg-stone-900 h-80 shadow-xl border border-white/10">
                        <div className="absolute inset-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4f29f67f-c043-4d68-9a80-d6f2dc0770fd_800w.jpg)] bg-cover"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white text-xl md:text-2xl leading-snug tracking-tight mb-1 font-nunito font-semibold">
                                {t.features.cards.craft.title}
                            </h3>
                            <p className="text-white/70 text-sm mb-3 font-nunito">{t.features.cards.craft.desc}</p>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/15 text-white/90 transition group-hover:bg-white/10">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M12 5v14"></path>
                                    <path d="M5 12h14"></path>
                                </svg>
                            </span>
                        </div>
                    </article>
                </div>
            </section>

            {/* Feature Highlights */}
            <section id="features" className="max-w-7xl mx-auto px-6 mt-16">
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                                    <path d="M3 9h18M9 21V9"></path>
                                </svg>
                            </span>
                            <div>
                                <h4 className="text-base font-semibold tracking-tight font-nunito text-white">{t.features.highlights.sprint.title}</h4>
                                <p className="text-sm text-white/70 font-nunito">{t.features.highlights.sprint.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="m12 5 7 7-7 7"></path>
                                    <path d="M5 5h.01"></path>
                                </svg>
                            </span>
                            <div>
                                <h4 className="text-base font-semibold tracking-tight font-nunito text-white">{t.features.highlights.keyboard.title}</h4>
                                <p className="text-sm text-white/70 font-nunito">{t.features.highlights.keyboard.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 3 7 8l4 5"></path>
                                    <path d="M17 3l-4 5 4 5"></path>
                                    <circle cx="5" cy="19" r="2"></circle>
                                    <circle cx="12" cy="19" r="2"></circle>
                                    <circle cx="19" cy="19" r="2"></circle>
                                </svg>
                            </span>
                            <div>
                                <h4 className="text-base font-semibold tracking-tight font-nunito text-white">{t.features.highlights.git.title}</h4>
                                <p className="text-sm text-white/70 font-nunito">{t.features.highlights.git.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v20"></path>
                                    <path d="M17 7H7a5 5 0 0 0 10 0Z"></path>
                                </svg>
                            </span>
                            <div>
                                <h4 className="text-base font-semibold tracking-tight font-nunito text-white">{t.features.highlights.roadmap.title}</h4>
                                <p className="text-sm text-white/70 font-nunito">{t.features.highlights.roadmap.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 9h6v6H9z"></path>
                                    <path d="M3 3h4v4H3zM17 17h4v4h-4zM17 3h4v4h-4zM3 17h4v4H3z"></path>
                                </svg>
                            </span>
                            <div>
                                <h4 className="text-base font-semibold tracking-tight font-nunito text-white">{t.features.highlights.customFields.title}</h4>
                                <p className="text-sm text-white/70 font-nunito">{t.features.highlights.customFields.desc}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20V10"></path>
                                    <path d="M18 20V4"></path>
                                    <path d="M6 20v-6"></path>
                                </svg>
                            </span>
                            <div>
                                <h4 className="text-base font-semibold tracking-tight font-nunito text-white">{t.features.highlights.analytics.title}</h4>
                                <p className="text-sm text-white/70 font-nunito">{t.features.highlights.analytics.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
