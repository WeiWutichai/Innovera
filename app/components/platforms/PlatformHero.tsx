"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { IconRenderer } from './IconMapper';

interface PlatformHeroProps {
    name: string;
    tagline: string;
    description: string;
    icon: string;
    color: string;
    gradient: string;
}

export default function PlatformHero({ name, tagline, description, icon, color, gradient }: PlatformHeroProps) {
    return (
        <section className={`relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br ${gradient} text-white`}>
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Breadcrumb */}
                <motion.nav
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-sm flex items-center font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full w-fit border border-white/20"
                >
                    <Link href="/" className="hover:text-white/80 transition flex items-center gap-1">
                        <span className="opacity-70">Home</span>
                    </Link>
                    <span className="mx-2 opacity-50">/</span>
                    <Link href="/#platforms" className="hover:text-white/80 transition">
                        <span className="opacity-70">Platforms</span>
                    </Link>
                    <span className="mx-2 opacity-50">/</span>
                    <span className="text-white font-bold">{name}</span>
                </motion.nav>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
                                <IconRenderer name={icon} className="w-10 h-10 text-white" />
                            </div>
                            <span className="text-lg font-bold tracking-widest uppercase opacity-80 border-l border-white/30 pl-4">{name}</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 font-sans tracking-tight leading-tight">
                            {tagline}
                        </h1>
                        <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed max-w-xl font-light">
                            {description}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/request-demo"
                                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center justify-center gap-2 uppercase tracking-wide text-sm group"
                            >
                                Request Demo
                                <IconRenderer name="ArrowRight" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/#contact"
                                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition inline-flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                            >
                                Contact Sales
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative bg-gradient-to-tr from-white/5 to-white/20 backdrop-blur-xl rounded-3xl p-1 border border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="bg-black/20 rounded-[22px] overflow-hidden aspect-[4/3] flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40"></div>
                                <IconRenderer name={icon} className="w-40 h-40 text-white/90 drop-shadow-2xl opacity-90 group-hover:scale-110 transition duration-500" />

                                {/* Abstract UI Elements */}
                                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 animate-pulse">
                                    <div className="h-2 w-1/3 bg-white/40 rounded mb-2"></div>
                                    <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }}></div>
                    </motion.div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg className="relative block w-full h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                </svg>
            </div>
        </section>
    );
}
