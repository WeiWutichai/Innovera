"use client";
import React, { useState, useEffect } from 'react';

export default function Robot() {
    const [isChatActive, setIsChatActive] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Threshold can be adjusted. 100px is a good start.
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const activateChat = () => {
        if (isChatActive) return;

        setIsChatActive(true);
        setIsJumping(true);

        setTimeout(() => {
            setIsJumping(false);
        }, 500);
    };

    const closeChat = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsChatActive(false);
    };

    // Dimensions for the Hero placeholder (must match the original size)
    const heroDimensions = "w-80 h-80 md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px]";

    return (
        // Placeholder container to prevent layout shift in Hero
        <div className={`${heroDimensions} relative transition-all duration-300`}>
            {/* The Floating Robot Container */}
            <div
                className={`transition-all duration-500 ease-in-out cursor-pointer z-50 flex justify-center items-center
                    ${isScrolled
                        ? 'fixed bottom-8 right-8 w-32 h-32' // Scrolled State
                        : 'absolute inset-0 w-full h-full'  // Hero State
                    }
                `}
                onMouseLeave={() => setIsChatActive(false)}
                onMouseEnter={activateChat}
            >
                {/* Chat Bubble */}
                <div className={`chat-bubble absolute bg-slate-800/90 backdrop-blur-md border border-cyan-500/50 p-4 rounded-2xl shadow-2xl z-20 ${isChatActive ? 'active' : ''}
                    ${isScrolled
                        ? 'w-60 -top-40 -left-48 md:-left-56 origin-bottom-right' // Position for Sticky (pop up to the left)
                        : '-top-16 -right-10 md:-right-24 w-64 origin-bottom-left' // Position for Hero
                    }
                `}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-cyan-400 text-sm font-semibold">AI Assistant</span>
                        <button onClick={closeChat} className="text-slate-400 hover:text-white text-xs">✕ ปิด</button>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">สวัสดีครับ! มีอะไรให้ผมช่วยไหมครับ?</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="พิมพ์คำถาม..."
                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-cyan-500"
                            onClick={(e) => e.stopPropagation()} // Prevent click from triggering robot jump? actually jump logic is on mouse enter
                        />
                        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-2 rounded transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                    {/* Tail of the bubble */}
                    <div className={`absolute w-4 h-4 bg-slate-800 border-r border-b border-cyan-500/50 transform rotate-45
                         ${isScrolled
                            ? '-bottom-2 right-4' // Tail for Sticky
                            : '-bottom-2 left-8'   // Tail for Hero
                        }
                    `}></div>
                </div>

                {/* Robot SVG Wrapper */}
                <div className={`w-full h-full ${isJumping ? 'robot-jump' : 'robot-container'} robot-glow`}>
                    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Shadow */}
                        <ellipse cx="200" cy="360" rx="80" ry="10" fill="black" fillOpacity="0.3" />

                        {/* Legs/Thrusters */}
                        <path d="M170 280 L200 320 L230 280" fill="#334155" />
                        <circle cx="200" cy="320" r="15" fill="#0ea5e9" opacity="0.8">
                            <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
                        </circle>

                        {/* Left Hand */}
                        <g className="robot-hand">
                            <path d="M130 200 C110 200, 90 180, 80 150" stroke="#94a3b8" strokeWidth="15" strokeLinecap="round" />
                            <circle cx="80" cy="150" r="15" fill="#cbd5e1" />
                        </g>

                        {/* Right Hand */}
                        <path d="M270 200 C290 200, 310 220, 320 250" stroke="#94a3b8" strokeWidth="15" strokeLinecap="round" />
                        <circle cx="320" cy="250" r="15" fill="#cbd5e1" />

                        {/* Body */}
                        <rect x="130" y="150" width="140" height="140" rx="40" fill="url(#bodyGradient)" />

                        {/* Screen on Tummy */}
                        <rect x="160" y="180" width="80" height="60" rx="10" fill="#1e293b" />
                        <text x="200" y="218" textAnchor="middle" fill="#22d3ee" fontSize="20" fontFamily="sans-serif" fontWeight="bold" letterSpacing="2" className="neon-text">
                            INNO
                            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
                        </text>

                        {/* Head */}
                        <rect x="120" y="60" width="160" height="100" rx="30" fill="url(#headGradient)" />

                        {/* Face Screen */}
                        <rect x="135" y="75" width="130" height="70" rx="20" fill="#0f172a" stroke="#334155" strokeWidth="2" />

                        {/* Eyes */}
                        <g className="robot-eye">
                            <circle cx="170" cy="110" r="12" fill="#22d3ee" className="neon-text" />
                            <circle cx="230" cy="110" r="12" fill="#22d3ee" className="neon-text" />
                        </g>

                        {/* Mouth */}
                        <path d="M190 125 Q200 130 210 125" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

                        {/* Antenna */}
                        <line x1="200" y1="60" x2="200" y2="30" stroke="#94a3b8" strokeWidth="6" />
                        <circle cx="200" cy="25" r="8" fill="#ef4444">
                            <animate attributeName="fill" values="#ef4444;#ff0000;#ef4444" dur="2s" repeatCount="indefinite" />
                        </circle>

                        {/* Gradients */}
                        <defs>
                            <linearGradient id="bodyGradient" x1="130" y1="150" x2="270" y2="290" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#e2e8f0" />
                                <stop offset="1" stopColor="#94a3b8" />
                            </linearGradient>
                            <linearGradient id="headGradient" x1="120" y1="60" x2="280" y2="160" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#f8fafc" />
                                <stop offset="1" stopColor="#cbd5e1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>
    );
}
