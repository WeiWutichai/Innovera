"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PlatformCTAProps {
    platformName: string;
    color: string;
    gradient: string;
}

export default function PlatformCTA({ platformName, color, gradient }: PlatformCTAProps) {
    return (
        <section className={`py-20 bg-gradient-to-br ${gradient} text-white relative overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '30px 30px'
                }}></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 font-sans">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                        Join thousands of satisfied customers using {platformName} to streamline their operations and boost productivity.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/request-demo"
                            className="bg-white text-gray-900 px-10 py-5 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg inline-flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                        >
                            Start Free Trial
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                        <Link
                            href="/#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                const contactSection = document.getElementById('contact');
                                if (contactSection) {
                                    contactSection.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition inline-flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                        >
                            Contact Sales
                        </Link>
                    </div>
                    <p className="mt-6 text-white/70 text-sm">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
