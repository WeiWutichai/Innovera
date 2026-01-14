"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface Plan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    recommended?: boolean;
    buttonText: string;
}

interface Pricing {
    title: string;
    subtitle: string;
    plans: Plan[];
}

interface PlatformPricingProps {
    pricing: Pricing;
    color: string;
}

export default function PlatformPricing({ pricing, color }: PlatformPricingProps) {
    return (
        <section className="py-20 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                    >
                        {pricing.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        {pricing.subtitle}
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {pricing.plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className={`relative rounded-3xl p-8 border ${plan.recommended ? 'border-2 shadow-2xl scale-105 z-10 bg-white' : 'border-gray-100 shadow-xl bg-gray-50/50'
                                }`}
                            style={{ borderColor: plan.recommended ? color : undefined }}
                        >
                            {plan.recommended && (
                                <div
                                    className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-white text-sm font-bold uppercase tracking-wide"
                                    style={{ backgroundColor: color }}
                                >
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-500 mb-6 h-12">{plan.description}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500 font-medium">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="mb-8 space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div
                                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                                            style={{ backgroundColor: `${color}20` }} // 20% opacity
                                        >
                                            <Check className="w-4 h-4" style={{ color: color }} />
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 ${plan.recommended
                                    ? 'text-white hover:shadow-lg'
                                    : 'bg-white border-2 text-gray-900 hover:border-transparent hover:text-white'
                                    }`}
                                style={
                                    plan.recommended
                                        ? { backgroundColor: color }
                                        : {
                                            borderColor: color,
                                            // Handling hover state in inline styles is tricky with simple variables,
                                            // relying on classes mostly but using style for dynamic color
                                        }
                                }
                            >
                                {plan.buttonText}
                            </button>

                            {/* Overlay for non-recommended button hover to fill color - Simplified approach logic */}
                            {!plan.recommended && (
                                <style jsx>{`
                                    button:hover {
                                        background-color: ${color} !important;
                                        color: white !important;
                                    }
                                `}</style>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
