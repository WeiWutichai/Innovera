"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SiteReference() {
    const { t } = useLanguage();

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = React.useState(false);

    // Auto-scroll logic
    React.useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { current } = scrollRef;
                const maxScroll = current.scrollWidth - current.clientWidth;

                // If we're near the end (within 10px), scroll back to start
                if (current.scrollLeft >= maxScroll - 10) {
                    current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Otherwise scroll right
                    current.scrollBy({ left: 400, behavior: 'smooth' });
                }
            }
        }, 3000); // Scroll every 3 seconds

        return () => clearInterval(interval);
    }, [isPaused]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -400 : 400;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section id="site-reference" className="py-24 bg-transparent border-t border-white/5 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-nunito tracking-tight">
                            {t.siteReference.title}
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl font-nunito">
                            {t.siteReference.subtitle}
                        </p>
                    </div>
                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {t.siteReference.items.map((item: any, index: number) => (
                        <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex-none w-full md:w-[400px] snap-center flex flex-col bg-stone-950/40 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden hover:-translate-y-1"
                        >
                            {/* Image Container */}
                            <div className="h-48 w-full bg-white p-6 flex items-center justify-center overflow-hidden relative">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="p-3 bg-stone-900 rounded-xl text-white">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-semibold text-white mb-2 font-nunito group-hover:text-pink-400 transition-colors">{item.title}</h3>
                                <p className="text-sm text-white/60 font-nunito leading-relaxed flex-grow">{item.desc}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/5 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full"></div>
            </div>
        </section>
    );
}
