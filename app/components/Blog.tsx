"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Blog() {
    // const { t } = useLanguage();

    return (
        <section id="blog" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-secondary mb-4 font-sans">Insights & Updates</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded"></div>
                    <p className="text-gray-600 mt-6 max-w-2xl mx-auto font-thai">ติดตามข่าวสาร เทรนด์เทคโนโลยี และบทความน่าสนใจจากทีมงานผู้เชี่ยวชาญ</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 reveal">
                    {/* Blog 1 */}
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group cursor-pointer">
                        <div className="relative overflow-hidden h-48">
                            <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="AI" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded text-primary font-sans">
                                TECHNOLOGY
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 font-sans">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                <span>March 15, 2024</span>
                            </div>
                            <h3 className="font-bold text-lg mb-3 leading-snug group-hover:text-primary transition font-sans">The Future of AI in Business: Trends to Watch</h3>
                            <a href="#" className="text-primary text-sm font-bold hover:underline flex items-center gap-1 font-sans">
                                READ MORE
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Blog 2 */}
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group cursor-pointer">
                        <div className="relative overflow-hidden h-48">
                            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Strategy" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded text-blue-600 font-sans">
                                BUSINESS
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 font-sans">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                <span>March 10, 2024</span>
                            </div>
                            <h3 className="font-bold text-lg mb-3 leading-snug group-hover:text-primary transition font-sans">Digital Transformation Strategy for 2024</h3>
                            <a href="#" className="text-primary text-sm font-bold hover:underline flex items-center gap-1 font-sans">
                                READ MORE
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Blog 3 */}
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group cursor-pointer">
                        <div className="relative overflow-hidden h-48">
                            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Security" className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded text-red-600 font-sans">
                                SECURITY
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 font-sans">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                <span>March 5, 2024</span>
                            </div>
                            <h3 className="font-bold text-lg mb-3 leading-snug group-hover:text-primary transition font-sans">Cyber Security Trends: Protecting Your Data</h3>
                            <a href="#" className="text-primary text-sm font-bold hover:underline flex items-center gap-1 font-sans">
                                READ MORE
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
