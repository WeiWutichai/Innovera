"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useChat } from '../context/ChatContext';
import ChatWindow from './chat/ChatWindow';

export default function Robot() {
    const { isOpen, openChat, closeChat } = useChat();
    const [showBubble, setShowBubble] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleRobotClick = () => {
        openChat();
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
    };

    const handleBubbleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openChat();
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
    };

    const handleCloseChat = (e: React.MouseEvent) => {
        e.stopPropagation();
        closeChat();
        setShowBubble(false);
    };

    const handleMouseEnter = () => {
        // Only show bubble in Hero section (not scrolled)
        if (!isOpen && !isScrolled) {
            setShowBubble(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isOpen && !isScrolled) {
            setShowBubble(false);
        }
    };

    // Dimensions for the Hero placeholder
    const heroDimensions = "w-80 h-80 md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px]";

    // Sticky Robot (rendered via Portal when scrolled)
    const stickyRobot = mounted && isScrolled ? createPortal(
        <div
            className="fixed bottom-8 right-8 w-32 h-32 cursor-pointer z-[99997] flex justify-center items-center"
            style={{ position: 'fixed', zIndex: 99997 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleRobotClick}
        >
            {/* Robot SVG */}
            <div className={`w-full h-full ${isJumping ? 'robot-jump' : 'robot-container'} robot-glow pointer-events-none`}>
                <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="200" cy="360" rx="80" ry="10" fill="black" fillOpacity="0.3" />
                    <path d="M170 280 L200 320 L230 280" fill="#334155" />
                    <circle cx="200" cy="320" r="15" fill="#0ea5e9" opacity="0.8">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
                    </circle>
                    <g className="robot-hand">
                        <path d="M130 200 C110 200, 90 180, 80 150" stroke="#94a3b8" strokeWidth="15" strokeLinecap="round" />
                        <circle cx="80" cy="150" r="15" fill="#cbd5e1" />
                    </g>
                    <path d="M270 200 C290 200, 310 220, 320 250" stroke="#94a3b8" strokeWidth="15" strokeLinecap="round" />
                    <circle cx="320" cy="250" r="15" fill="#cbd5e1" />
                    <rect x="130" y="150" width="140" height="140" rx="40" fill="url(#bodyGradient)" />
                    <rect x="160" y="180" width="80" height="60" rx="10" fill="#1e293b" />
                    <text x="200" y="218" textAnchor="middle" fill="#22d3ee" fontSize="20" fontFamily="sans-serif" fontWeight="bold" letterSpacing="2" className="neon-text">
                        INNO
                        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
                    </text>
                    <rect x="120" y="60" width="160" height="100" rx="30" fill="url(#headGradient)" />
                    <rect x="135" y="75" width="130" height="70" rx="20" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <g className="robot-eye">
                        <circle cx="170" cy="110" r="12" fill="#22d3ee" className="neon-text" />
                        <circle cx="230" cy="110" r="12" fill="#22d3ee" className="neon-text" />
                    </g>
                    <path d="M190 125 Q200 130 210 125" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                    <line x1="200" y1="60" x2="200" y2="30" stroke="#94a3b8" strokeWidth="6" />
                    <circle cx="200" cy="25" r="8" fill="#ef4444">
                        <animate attributeName="fill" values="#ef4444;#ff0000;#ef4444" dur="2s" repeatCount="indefinite" />
                    </circle>
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
        </div>,
        document.body
    ) : null;

    return (
        <>
            {/* Hero Robot (static position in Hero section) */}
            <div className={`${heroDimensions} relative transition-all duration-300`}>
                {!isScrolled && (
                    <div
                        className="absolute inset-0 w-full h-full cursor-pointer z-50 flex justify-center items-center"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleRobotClick}
                    >
                        {/* Message Bubble */}
                        {(showBubble || isOpen) && (
                            <div
                                className={`chat-bubble absolute bg-slate-800/90 backdrop-blur-md border border-cyan-500/50 p-4 rounded-2xl shadow-2xl z-20 -top-16 -right-10 md:-right-24 w-64 origin-bottom-left cursor-pointer ${showBubble || isOpen ? 'active' : ''}`}
                                style={{
                                    opacity: showBubble || isOpen ? 1 : 0,
                                    visibility: showBubble || isOpen ? 'visible' : 'hidden',
                                    pointerEvents: showBubble || isOpen ? 'auto' : 'none',
                                    transform: showBubble || isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                                onClick={handleBubbleClick}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-cyan-400 text-sm font-semibold">น้องอินโน</span>
                                    <button onClick={handleCloseChat} className="text-slate-400 hover:text-white text-xs">✕ ปิด</button>
                                </div>
                                <p className="text-xs text-slate-300 mb-3">
                                    {isOpen
                                        ? "กำลังเปิดแชท... 💬"
                                        : "สวัสดีครับ ผมน้องอินโน! 👋 คลิกที่นี่เพื่อเริ่มแชทกับผมได้เลยครับ"
                                    }
                                </p>
                                <div className="absolute w-4 h-4 bg-slate-800 border-r border-b border-cyan-500/50 transform rotate-45 -bottom-2 left-8"></div>
                            </div>
                        )}

                        {/* Robot SVG */}
                        <div className={`w-full h-full ${isJumping ? 'robot-jump' : 'robot-container'} robot-glow pointer-events-none`}>
                            <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="200" cy="360" rx="80" ry="10" fill="black" fillOpacity="0.3" />
                                <path d="M170 280 L200 320 L230 280" fill="#334155" />
                                <circle cx="200" cy="320" r="15" fill="#0ea5e9" opacity="0.8">
                                    <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
                                </circle>
                                <g className="robot-hand">
                                    <path d="M130 200 C110 200, 90 180, 80 150" stroke="#94a3b8" strokeWidth="15" strokeLinecap="round" />
                                    <circle cx="80" cy="150" r="15" fill="#cbd5e1" />
                                </g>
                                <path d="M270 200 C290 200, 310 220, 320 250" stroke="#94a3b8" strokeWidth="15" strokeLinecap="round" />
                                <circle cx="320" cy="250" r="15" fill="#cbd5e1" />
                                <rect x="130" y="150" width="140" height="140" rx="40" fill="url(#bodyGradient2)" />
                                <rect x="160" y="180" width="80" height="60" rx="10" fill="#1e293b" />
                                <text x="200" y="218" textAnchor="middle" fill="#22d3ee" fontSize="20" fontFamily="sans-serif" fontWeight="bold" letterSpacing="2" className="neon-text">
                                    INNO
                                    <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
                                </text>
                                <rect x="120" y="60" width="160" height="100" rx="30" fill="url(#headGradient2)" />
                                <rect x="135" y="75" width="130" height="70" rx="20" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                                <g className="robot-eye">
                                    <circle cx="170" cy="110" r="12" fill="#22d3ee" className="neon-text" />
                                    <circle cx="230" cy="110" r="12" fill="#22d3ee" className="neon-text" />
                                </g>
                                <path d="M190 125 Q200 130 210 125" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                                <line x1="200" y1="60" x2="200" y2="30" stroke="#94a3b8" strokeWidth="6" />
                                <circle cx="200" cy="25" r="8" fill="#ef4444">
                                    <animate attributeName="fill" values="#ef4444;#ff0000;#ef4444" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <defs>
                                    <linearGradient id="bodyGradient2" x1="130" y1="150" x2="270" y2="290" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#e2e8f0" />
                                        <stop offset="1" stopColor="#94a3b8" />
                                    </linearGradient>
                                    <linearGradient id="headGradient2" x1="120" y1="60" x2="280" y2="160" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#f8fafc" />
                                        <stop offset="1" stopColor="#cbd5e1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Render sticky robot via Portal */}
            {stickyRobot}

            {/* ChatWindow - rendered via Portal in ChatWindow component */}
            <ChatWindow />
        </>
    );
}
