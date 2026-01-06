import React from 'react';

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M20 5L30 10V30L20 35L10 30V10L20 5Z"
                fill="url(#logo-gradient)"
                fillOpacity="0.2"
                stroke="url(#logo-gradient-stroke)"
                strokeWidth="2"
            />
            <path
                d="M20 12L26 15V25L20 28L14 25V15L20 12Z"
                fill="url(#logo-gradient-inner)"
            />
            <defs>
                <linearGradient id="logo-gradient" x1="10" y1="5" x2="30" y2="35" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="logo-gradient-stroke" x1="10" y1="5" x2="30" y2="35" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#818cf8" />
                    <stop offset="1" stopColor="#c084fc" />
                </linearGradient>
                <linearGradient id="logo-gradient-inner" x1="14" y1="12" x2="26" y2="28" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="1" stopColor="#e0e7ff" />
                </linearGradient>
            </defs>
        </svg>
    );
}
