"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import StatsContent from './StatsContent';

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ServiceModal({ isOpen, onClose }: ServiceModalProps) {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            // Small delay to allow mounting before animation starts
            requestAnimationFrame(() => setIsVisible(true));
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                document.body.style.overflow = 'unset';
            }, 300); // Wait for exit animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted) return null;

    if (!isOpen && !isVisible) return null;

    return createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${isVisible ? '' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity duration-[1200ms] cubic-bezier(0.34, 1.3, 0.64, 1) ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.3, 0.64, 1)' }}
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className={`relative bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-[1200ms] cubic-bezier(0.34, 1.3, 0.64, 1) ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.3, 0.64, 1)' }}
            >
                <div className="p-1">
                    <div className="max-h-[85vh] overflow-y-auto scrollbar-hide p-6 md:p-8">
                        <StatsContent />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
