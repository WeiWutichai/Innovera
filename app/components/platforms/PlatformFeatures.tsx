"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { IconRenderer } from './IconMapper';

interface Feature {
    title: string;
    description: string;
    icon: string;
}

interface PlatformFeaturesProps {
    features: Feature[];
    color: string;
}

export default function PlatformFeatures({ features, color }: PlatformFeaturesProps) {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-secondary mb-4 font-sans">
                        Key Features
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need to streamline your operations and boost productivity
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gray-200 to-transparent group-hover:from-secondary transition-all duration-300"></div>
                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6 text-secondary group-hover:scale-110 group-hover:bg-gray-100 transition-all duration-300">
                                <IconRenderer name={feature.icon} className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-3 font-sans group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
