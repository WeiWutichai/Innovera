"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
    // Close modal when clicking outside
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Close modal on Escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, type: "spring", damping: 25 }}
                        className="relative w-full max-w-5xl bg-secondary rounded-2xl shadow-2xl overflow-hidden border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                            aria-label="Close modal"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* Video Container */}
                        <div className="relative aspect-video bg-black">
                            {videoUrl ? (
                                // Check if it's a local video file (mp4, webm, etc.)
                                videoUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                                    <video
                                        className="w-full h-full"
                                        controls
                                        autoPlay
                                        playsInline
                                        src={videoUrl}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    // For YouTube/Vimeo embeds
                                    <iframe
                                        className="w-full h-full"
                                        src={videoUrl}
                                        title="Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
                                    <div className="w-20 h-20 mb-6 bg-primary/20 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-10 h-10 text-primary"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 font-sans">Video Coming Soon</h3>
                                    <p className="text-gray-400 text-center max-w-md font-sans">
                                        We're preparing an amazing video to showcase our platform.
                                        Stay tuned!
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
