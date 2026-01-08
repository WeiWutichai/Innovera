"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function FeatureHighlights() {
    const { t } = useLanguage();

    return (
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
    );
}
