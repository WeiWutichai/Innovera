
export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/af0a80bd-7501-40ee-990b-69ed1cfcde25_3840w.jpg)] bg-cover">
            <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-pink-500/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-48 -right-40 w-[520px] h-[520px] bg-pink-500/10 blur-3xl rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-6 flex flex-col justify-center">
                    <div className="inline-flex gap-2 w-max text-xs text-white/80 bg-white/5 border-white/10 border rounded-full mb-4 px-2.5 py-1 backdrop-blur-lg items-center font-nunito">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-red-400"></span>
                        Ship faster with fewer meetings
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight font-nunito font-semibold text-white">
                        Built for modern<br className="hidden md:block" /> product teams
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed font-nunito">
                        Innovera is shaped by the habits of elite builders: tight feedback loops, ruthless prioritization,
                        and a commitment to craft. Plan roadmaps, track sprints, and ship with confidence—without the overhead.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <a href="#" className="inline-flex items-center justify-center h-11 hover:bg-white/90 transition text-sm font-medium text-stone-900 bg-white rounded-xl px-4 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] font-nunito">
                            Create workspace
                            <svg width="18" height="18" viewBox="0 0 24 24" className="ml-1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 5v14"></path>
                                <path d="M5 12h14"></path>
                            </svg>
                        </a>
                        <a href="#" className="inline-flex items-center justify-center h-11 hover:text-white hover:border-white/20 transition text-sm text-white/90 border-white/10 border rounded-xl px-4 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] backdrop-blur-lg font-nunito">
                            Book a demo
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
                        <span className="font-nunito">Trusted by 2,400+ teams • 4.9/5 satisfaction</span>
                    </div>
                </div>

                {/* Hero visual */}
                <div className="lg:col-span-6">
                    <div className="relative sm:p-6 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] bg-gradient-to-b from-white/[0.03] to-transparent border-white/10 border rounded-3xl p-4 backdrop-blur-lg">
                        <div className="grid grid-cols-12 gap-3">
                            {/* Left tall card */}
                            <div className="col-span-12 md:col-span-6 space-y-3">
                                <div className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/10 bg-stone-900">
                                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/8d57793a-634a-4c7d-9968-fced612582e1_800w.jpg" alt="Product board" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-white/60 font-nunito">Sprint overview</p>
                                            <p className="text-lg font-semibold tracking-tight font-nunito text-white">Velocity up 18%</p>
                                        </div>
                                        <span className="inline-flex items-center h-8 px-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80 font-nunito">
                                            <svg width="18" height="18" viewBox="0 0 24 24" className="mr-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                <path d="M3 3v18h18"></path>
                                                <path d="M19 9l-6 6-4-4-4 4"></path>
                                            </svg>
                                            Trend
                                        </span>
                                    </div>
                                </div>

                                <div className="relative h-28 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
                                    <div className="absolute inset-0 flex items-center justify-between px-4">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M3 7h18"></path>
                                                    <path d="M6 4h12v16H6z"></path>
                                                    <path d="M8 11h8"></path>
                                                    <path d="M8 15h5"></path>
                                                </svg>
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium tracking-tight font-nunito text-white">Backlog grooming</p>
                                                <p className="text-xs text-white/60 font-nunito">Reduce carryover by 32%</p>
                                            </div>
                                        </div>
                                        <button className="inline-flex items-center h-8 px-2 rounded-lg bg-white text-stone-900 text-xs font-medium hover:bg-white/90 transition font-nunito">
                                            Open
                                            <svg width="16" height="16" viewBox="0 0 24 24" className="ml-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14"></path>
                                                <path d="M12 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right stack */}
                            <div className="col-span-12 md:col-span-6 space-y-3">
                                <div className="relative h-28 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
                                    <div className="absolute inset-0 flex items-center justify-between px-4">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                                    <path d="M9 18V5l12-2v13"></path>
                                                    <circle cx="6" cy="18" r="3"></circle>
                                                    <circle cx="18" cy="16" r="3"></circle>
                                                </svg>
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium tracking-tight font-nunito text-white">Branch previews</p>
                                                <p className="text-xs text-white/60 font-nunito">Auto-link PRs to issues</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-red-400 font-nunito">Synced</span>
                                    </div>
                                </div>

                                <div className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/10 bg-stone-900">
                                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/89eb3a29-9852-4008-8865-22926b2c8cb0_800w.jpg" alt="Deployment" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-white/60 font-nunito">Release train</p>
                                            <p className="text-lg font-semibold tracking-tight font-nunito text-white">0 incidents this week</p>
                                        </div>
                                        <span className="inline-flex items-center h-8 text-xs text-white/80 bg-white/5 border-white/10 border rounded-lg px-2 font-nunito">Rollback</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="border-white/10 border rounded-xl py-2 px-3 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] backdrop-blur-lg">
                            <p className="text-xs text-white/60 font-nunito">Lead time</p>
                            <p className="text-base font-semibold tracking-tight font-nunito text-white">2.1d</p>
                        </div>
                        <div className="border-white/10 border rounded-xl py-2 px-3 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] backdrop-blur-lg">
                            <p className="text-xs text-white/60 font-nunito">On-time delivery</p>
                            <p className="text-base font-semibold tracking-tight font-nunito text-white">96%</p>
                        </div>
                        <div className="border-white/10 border rounded-xl py-2 px-3 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] backdrop-blur-lg">
                            <p className="text-xs text-white/60 font-nunito">Cycle time</p>
                            <p className="text-base font-semibold tracking-tight font-nunito text-white">7.4h</p>
                        </div>
                        <div className="border-white/10 border rounded-xl py-2 px-3 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] backdrop-blur-lg">
                            <p className="text-xs text-white/60 font-nunito">NPS</p>
                            <p className="text-base font-semibold tracking-tight font-nunito text-white">72</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
