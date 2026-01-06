"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Blog() {
    const { t } = useLanguage();

    return (
        <section id="blog" className="py-24 bg-transparent border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-nunito tracking-tight">
                            {t.blog.title}
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl font-nunito">
                            {t.blog.subtitle}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {t.blog.items.map((item: any, index: number) => (
                        <a
                            key={index}
                            href={item.url.startsWith('http') ? item.url : `/blog/${item.url.replace(/^\/|\/$/g, '')}`}
                            className="group flex flex-col bg-[#1A1D21] rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300 border border-white/5 shadow-2xl"
                        >
                            {/* Image Container */}
                            <div className="h-48 w-full bg-white p-8 flex items-center justify-center relative">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-grow bg-gradient-to-b from-[#1A1D21] to-[#0d0f12]">
                                <div className="flex items-center gap-3 text-xs font-bold text-pink-500 mb-4 font-nunito uppercase tracking-widest">
                                    <span>{item.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-pink-500"></span>
                                    <span>{item.readTime}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 font-nunito leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-nunito mb-8 line-clamp-3">
                                    {item.desc}
                                </p>
                                <div className="flex items-center text-sm font-bold text-white group-hover:text-pink-400 transition-colors font-nunito mt-auto tracking-wide">
                                    Read more
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5l7 7-7 7"></path>
                                    </svg>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
