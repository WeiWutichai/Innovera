"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, Globe } from 'lucide-react';
import Image from 'next/image';

const languages = [
    {
        code: 'en',
        name: 'English',
        flag: 'https://flagcdn.com/w40/us.png' // Using public flag CDN for now, or emojis
    },
    {
        code: 'th',
        name: 'Thai',
        flag: 'https://flagcdn.com/w40/th.png'
    }
];

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (code: string) => {
        setLanguage(code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition font-sans font-medium text-sm focus:outline-none"
            >
                {/* Selected Language Display */}
                <span className="hidden md:inline">{currentLang.name}</span>
                {/* Mobile: Just Flag or Code? Let's stick to name for consistency with request */}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleSelect(lang.code as any)}
                            className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${language === lang.code ? 'text-primary font-bold bg-primary/5' : 'text-gray-600'
                                }`}
                        >
                            <img
                                src={lang.flag}
                                alt={lang.name}
                                className="w-5 h-auto rounded-sm shadow-sm opacity-80"
                            />
                            <span className="text-sm">{lang.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
