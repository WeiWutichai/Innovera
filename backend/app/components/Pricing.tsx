
export default function Pricing() {
    return (
        <section id="customers" className="max-w-7xl mx-auto px-6 mt-16">
            <div className="md:p-8 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/530253a4-3b35-4eb5-8783-d351361683ca_1600w.jpg)] bg-cover border-white/10 rounded-3xl pt-6 pr-6 pb-6 pl-6">
                {/* Testimonials */}
                <div className="grid md:grid-cols-3 gap-6 items-center mb-16">
                    <div>
                        <p className="text-sm text-white/70 font-nunito">What teams say</p>
                        <p className="text-lg font-semibold tracking-tight mt-1 font-nunito text-white">"Innovera cut our cycle time by 35% in a month."</p>
                        <div className="flex items-center gap-2 mt-3">
                            <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/46c1c487-d923-41a3-b3e4-6c293d89f0fe_320w.jpg" alt="Customer" className="h-8 w-8 rounded-full object-cover" />
                            <div className="text-xs">
                                <p className="text-white/90 font-nunito">Riya Sharma</p>
                                <p className="text-white/50 font-nunito">VP Engineering, Orbitly</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                        <div className="h-16 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
                            <span className="text-white/80 font-semibold tracking-tight font-nunito">ALFA</span>
                        </div>
                        <div className="h-16 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
                            <span className="text-white/80 font-semibold tracking-tight font-nunito">NOVA</span>
                        </div>
                        <div className="h-16 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
                            <span className="text-white/80 font-semibold tracking-tight font-nunito">LYRA</span>
                        </div>
                        <div className="h-16 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
                            <span className="text-white/80 font-semibold tracking-tight font-nunito">KITE</span>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <h3 className="md:text-3xl text-2xl tracking-tight font-nunito font-semibold text-white">Simple, transparent pricing</h3>
                        <p className="text-white/70 mt-2 font-nunito">Start free, scale as you grow</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Free Plan */}
                        <div className="border-white/10 border rounded-2xl p-6">
                            <h4 className="text-lg font-semibold tracking-tight font-nunito text-white">Free</h4>
                            <p className="text-white/70 text-sm mt-1 font-nunito">Perfect for small teams getting started</p>
                            <div className="mt-4 mb-6">
                                <span className="text-3xl tracking-tight font-nunito font-semibold text-white">$0</span>
                                <span className="text-white/60 text-sm font-nunito">/month</span>
                            </div>
                            <ul className="space-y-3 text-sm text-white/80">
                                <li className="flex items-center gap-2 font-nunito">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Up to 5 team members
                                </li>
                                <li className="flex items-center gap-2 font-nunito">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Unlimited issues
                                </li>
                                <li className="flex items-center gap-2 font-nunito">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Basic analytics
                                </li>
                            </ul>
                            <button className="w-full mt-6 h-10 rounded-lg border border-white/10 text-white/90 hover:bg-white/5 transition text-sm font-nunito">
                                Get started
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 relative">
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-white text-stone-900 text-xs font-medium px-3 py-1 rounded-full font-nunito">Most popular</span>
                            </div>
                            <h4 className="text-lg font-semibold tracking-tight font-nunito text-white">Pro</h4>
                            <p className="text-white/70 text-sm mt-1 font-nunito">For growing teams that ship fast</p>
                            <div className="mt-4 mb-6">
                                <span className="text-3xl tracking-tight font-nunito font-semibold text-white">$12</span>
                                <span className="text-white/60 text-sm font-nunito">/user/month</span>
                            </div>
                            <ul className="space-y-3 text-sm text-white/80">
                                <li className="flex items-center gap-2 font-nunito">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Everything in Free
                                </li>
                                <li className="flex items-center gap-2 font-nunito">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Advanced analytics
                                </li>
                                <li className="flex items-center gap-2 font-nunito">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Git integrations
                                </li>
                            </ul>
                            <button className="w-full mt-6 h-10 rounded-lg bg-white text-stone-900 font-medium hover:bg-white/90 transition text-sm font-nunito">
                                Start free trial
                            </button>
                        </div>

                        {/* Enterprise Plan */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                            <h4 className="text-lg font-semibold tracking-tight font-nunito text-white">Enterprise</h4>
                            <p className="text-white/70 text-sm mt-1 font-nunito">For large organizations with specific needs</p>
                            <div className="mt-4 mb-6">
                                <span className="text-2xl tracking-tight font-nunito font-semibold text-white">Custom</span>
                            </div>
                            <ul className="space-y-3 text-sm text-white/80">
                                <li className="flex items-center gap-2 font-nunito">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Everything in Pro
                                </li>
                                <li className="flex items-center gap-2 font-nunito">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    SSO & security controls
                                </li>
                                <li className="flex items-center gap-2 font-nunito">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Priority support
                                </li>
                            </ul>
                            <button className="w-full mt-6 h-10 rounded-lg border border-white/10 text-white/90 hover:bg-white/5 transition text-sm font-nunito">
                                Contact sales
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
