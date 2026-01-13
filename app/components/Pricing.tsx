"use client";
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Pricing() {
    // const { t } = useLanguage();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <section id="pricing" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-secondary mb-4 font-sans">Simple, Transparent Pricing</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-sans">Choose the perfect plan for your business needs.</p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center mt-8 gap-4 font-sans">
                        <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-secondary' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-8 bg-gray-200 rounded-full relative transition-colors duration-300 focus:outline-none"
                        >
                            <div className={`w-6 h-6 bg-primary rounded-full absolute top-1 transition-transform duration-300 shadow-md ${billingCycle === 'monthly' ? 'left-1' : 'translate-x-7'}`}></div>
                        </button>
                        <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-secondary' : 'text-gray-400'}`}>
                            Yearly <span className="text-primary text-xs ml-1">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto reveal">
                    {/* Starter Plan */}
                    <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition duration-300 relative group">
                        <h3 className="text-xl font-bold text-secondary mb-2 font-sans">Starter</h3>
                        <p className="text-gray-500 text-sm mb-6 font-sans">Perfect for small teams and startups.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-secondary font-sans">{billingCycle === 'monthly' ? '$0' : '$0'}</span>
                            <span className="text-gray-400 font-sans">/month</span>
                        </div>
                        <a href="#" className="block w-full py-3 border border-secondary text-secondary font-bold text-center rounded hover:bg-secondary hover:text-white transition uppercase text-sm font-sans">
                            Get Started
                        </a>
                        <ul className="mt-8 space-y-4 text-sm text-gray-600 font-sans">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Up to 5 users
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Basic Automation
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Community Support
                            </li>
                        </ul>
                    </div>

                    {/* Professional Plan */}
                    <div className="border-2 border-primary rounded-2xl p-8 shadow-2xl relative transform md:-translate-y-4 bg-white z-10">
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg font-sans">
                            POPULAR
                        </div>
                        <h3 className="text-xl font-bold text-secondary mb-2 font-sans">Professional</h3>
                        <p className="text-gray-500 text-sm mb-6 font-sans">For growing businesses needing more power.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-secondary font-sans">{billingCycle === 'monthly' ? '$49' : '$39'}</span>
                            <span className="text-gray-400 font-sans">/month</span>
                        </div>
                        <a href="#" className="block w-full py-3 bg-primary text-white font-bold text-center rounded hover:bg-primary-hover shadow-lg transition uppercase text-sm font-sans">
                            Get Started
                        </a>
                        <ul className="mt-8 space-y-4 text-sm text-gray-600 font-sans">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Up to 20 users
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Advanced Workflows
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Analytics Dashboard
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Priority Email Support
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                API Access
                            </li>
                        </ul>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition duration-300 relative group">
                        <h3 className="text-xl font-bold text-secondary mb-2 font-sans">Enterprise</h3>
                        <p className="text-gray-500 text-sm mb-6 font-sans">Custom solutions for large organizations.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-secondary font-sans">Custom</span>
                        </div>
                        <a href="#contact" className="block w-full py-3 border border-secondary text-secondary font-bold text-center rounded hover:bg-secondary hover:text-white transition uppercase text-sm font-sans">
                            Contact Sales
                        </a>
                        <ul className="mt-8 space-y-4 text-sm text-gray-600 font-sans">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Unlimited users
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Custom Integrations
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Dedicated Success Manager
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                24/7 Phone Support
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                SLA 99.9% Uptime
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
