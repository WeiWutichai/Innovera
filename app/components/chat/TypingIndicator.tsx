"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-orange-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">🤖</span>
                </div>
                <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
