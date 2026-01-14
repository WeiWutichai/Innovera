"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface Benefits {
    title: string;
    items: string[];
}

interface UseCase {
    title: string;
    description: string;
}

interface PlatformBenefitsProps {
    benefits: Benefits;
    useCases: UseCase[];
    color: string;
}

export default function PlatformBenefits({ benefits, useCases, color }: PlatformBenefitsProps) {
    return (
        <section className="py-20 bg-gray-50/50">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Benefits */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-8 font-sans">
                            {benefits.title}
                        </h2>
                        <div className="space-y-4">
                            {benefits.items.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300"
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    </div>
                                    <p className="text-lg text-gray-700 leading-snug">{item}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Use Cases */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-8 font-sans">
                            Perfect For
                        </h2>
                        <div className="space-y-6">
                            {useCases.map((useCase, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
                                >
                                    <h3 className="text-xl font-bold text-secondary mb-2 font-sans">
                                        {useCase.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {useCase.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
