"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { IconRenderer } from '@/app/components/platforms/IconMapper';

interface IntegrationHeroProps {
    name: string;
    tagline: string;
    description: string;
    icon: string;
    color: string;
    gradient: string;
    supportedItems: string[];
}

export default function IntegrationHero({
    name,
    tagline,
    description,
    icon,
    color,
    gradient,
    supportedItems
}: IntegrationHeroProps) {
    const pathname = usePathname();

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Background Decorations */}
            <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none">
                <div className={`absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br ${gradient} opacity-[0.08] blur-3xl`} />
                <div className={`absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr ${gradient} opacity-[0.08] blur-3xl`} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 w-full text-center lg:text-left"
                    >
                        {/* Breadcrumb Styled */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 mb-8 mx-auto lg:mx-0">
                            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-500">Integrations</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold" style={{ color: color }}>{name}</span>
                        </div>

                        <div className="mb-4 inline-flex items-center justify-center lg:justify-start gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`} style={{ backgroundColor: `${color}15` }}>
                                <IconRenderer name={icon} className="w-7 h-7" style={{ color: color }} />
                            </div>
                            <span className="text-lg font-bold tracking-wide uppercase opacity-80" style={{ color: color }}>INTEGRATION</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                            {name}
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {tagline}
                        </p>

                        <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {description}
                        </p>

                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-10">
                            {supportedItems.map((item, idx) => (
                                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-md">
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="/request-demo"
                                className={`px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r ${gradient}`}
                            >
                                Connect Now
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 rounded-xl bg-white text-gray-700 border border-gray-200 font-bold text-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                            >
                                Documentation
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 w-full relative"
                    >
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 bg-white/50 backdrop-blur-sm group">
                            {/* Connector Visual Construction */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-full max-w-md p-8">
                                    <div className="flex justify-between items-center mb-8 relative z-10">
                                        {/* Innovera Node */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100">
                                                <img src="/innovera-logo-square.png" alt="Innovera" className="w-12 h-12 object-contain opacity-80" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                {/* Fallback if no logo image */}
                                                <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-bold text-xl">IV</div>
                                            </div>
                                            <span className="font-bold text-gray-700">Innovera</span>
                                        </div>

                                        {/* Connection Line */}
                                        <div className="flex-1 h-2 mx-4 bg-gray-100 rounded-full relative overflow-hidden">
                                            <motion.div
                                                animate={{ x: [-100, 200] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className={`absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r ${gradient}`}
                                            />
                                        </div>

                                        {/* Partner Node */}
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100">
                                                <IconRenderer name={icon} className="w-10 h-10" style={{ color: color }} />
                                            </div>
                                            <span className="font-bold text-gray-700">{name}</span>
                                        </div>
                                    </div>

                                    {/* Abstract Data Flow Cards */}
                                    <div className="space-y-3 relative z-0 opacity-80">
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between"
                                        >
                                            <div className="h-2 w-24 bg-gray-200 rounded"></div>
                                            <div className="h-2 w-8 bg-green-100 text-green-600 text-xs flex items-center justify-center rounded">Sync</div>
                                        </motion.div>
                                        <motion.div
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                            className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between"
                                        >
                                            <div className="h-2 w-32 bg-gray-200 rounded"></div>
                                            <div className="h-2 w-8 bg-blue-100 text-blue-600 text-xs flex items-center justify-center rounded">200 OK</div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Glass Overlay */}
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                        </div>

                        {/* Floating Blob Behind */}
                        <div className={`absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr ${gradient} opacity-20 blur-3xl rounded-full`} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
