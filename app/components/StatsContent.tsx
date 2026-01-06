"use client";
import React from 'react';

import { useLanguage } from '../context/LanguageContext';

function StatItem({ title, value, visual }: { title: string, value: string, visual?: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-[#0A0A0C] p-4 flex items-center justify-between">
            <div>
                <p className="text-sm text-white/50 mb-1 font-nunito">{title}</p>
                <p className="text-xl font-bold text-white font-nunito">{value}</p>
            </div>
            {visual}
        </div>
    );
}

export default function StatsContent() {
    const { t } = useLanguage();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Velocity Card */}
                    <div className="relative rounded-3xl overflow-hidden bg-[#0D0D10] border border-white/10 p-6 h-80 flex flex-col justify-between">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl"></div>
                        <div className="relative z-10 flex justify-center items-center flex-grow">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#1a1f2e] to-[#2d3a4f] shadow-2xl flex items-center justify-center border border-white/5">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-400 opacity-50">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 6v6l4 2"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white font-nunito mb-2">{t.hero.cards.customSoftware.title}</h3>
                            <p className="text-sm text-white/70 font-nunito leading-relaxed">
                                {t.hero.cards.customSoftware.desc}
                            </p>
                        </div>
                    </div>

                    {/* Backlog Card */}
                    <div className="relative rounded-3xl overflow-hidden bg-[#1C1C1F] border border-white/10 p-6 flex items-center justify-between">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-white font-nunito">{t.hero.cards.backlog.title}</h4>
                                <p className="text-sm text-white/50 font-nunito">{t.hero.cards.backlog.desc}</p>
                            </div>
                        </div>
                        <button className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white text-stone-900 text-sm font-medium hover:bg-gray-100 transition-colors font-nunito">
                            {t.hero.cards.backlog.open}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Branch Previews Card */}
                    <div className="relative rounded-3xl overflow-hidden bg-[#161618] border border-white/10 p-6 flex items-center justify-between">
                        <div className="absolute inset-0 bg-gradient-to-l from-blue-500/10 to-transparent"></div>
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18V5l12-2v13"></path>
                                    <circle cx="6" cy="18" r="3"></circle>
                                    <circle cx="18" cy="16" r="3"></circle>
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium text-white font-nunito">{t.hero.cards.branch.title}</h4>
                                <p className="text-sm text-white/50 font-nunito">{t.hero.cards.branch.desc}</p>
                            </div>
                        </div>
                        <div className="relative z-10 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 font-nunito">
                            {t.hero.cards.branch.synced}
                        </div>
                    </div>

                    {/* Release Train Card */}
                    <div className="group relative rounded-3xl overflow-hidden bg-[#0F0F12] border border-white/10 p-6 h-80 flex flex-col justify-end">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-900/30 rotate-45 transform border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.2)]"></div>
                        </div>

                        <div className="relative z-20">
                            <p className="text-sm text-white/50 mb-1 font-nunito">{t.hero.cards.release.title}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-2xl font-bold text-white font-nunito leading-tight">{t.hero.cards.release.val}<br />{t.hero.cards.release.time}</h3>
                                <button className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white/50 hover:text-white hover:bg-white/10 transition-colors font-nunito">
                                    {t.hero.cards.release.rollback}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <StatItem title={t.hero.cards.stats.leadTime} value="2.1d" />
                <StatItem title={t.hero.cards.stats.onTime} value="96%" />
                <StatItem title={t.hero.cards.stats.cycleTime} value="7.4h" />
                <StatItem
                    title={t.hero.cards.stats.nps}
                    value="72"
                    visual={<div className="w-12 h-8 rounded bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></div>}
                />
            </div>
        </div>
    );
}
