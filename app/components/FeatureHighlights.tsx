"use client";
import React from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Scale,
    Activity,
    Building,
    Database,
    Sparkles,
    Cloud
} from 'lucide-react';

export default function FeatureHighlights() {
    // const { t } = useLanguage(); 

    const platforms = [
        {
            name: "INNO ONE",
            slug: "inno-one",
            icon: <LayoutDashboard className="w-10 h-10" />,
            color: "text-blue-600",
            hoverBorder: "hover:border-blue-600",
            hoverShadow: "hover:shadow-blue-600/20"
        },
        {
            name: "LAWFIRM",
            slug: "lawfirm",
            icon: <Scale className="w-10 h-10" />,
            color: "text-slate-700",
            hoverBorder: "hover:border-slate-700",
            hoverShadow: "hover:shadow-slate-700/20"
        },
        {
            name: "PHYSICAL THERAPY",
            slug: "physical-therapy",
            icon: <Activity className="w-10 h-10" />,
            color: "text-rose-500",
            hoverBorder: "hover:border-rose-500",
            hoverShadow: "hover:shadow-rose-500/20"
        },
        {
            name: "DORMITORY",
            slug: "dormitory",
            icon: <Building className="w-10 h-10" />,
            color: "text-emerald-600",
            hoverBorder: "hover:border-emerald-600",
            hoverShadow: "hover:shadow-emerald-600/20"
        }
    ];

    const integrations = [
        {
            name: "SAP",
            slug: "sap",
            icon: <Database className="w-10 h-10" />,
            color: "text-[#003366]", // SAP Dark Blue
            // Fallback class if JIT doesn't pick up hex in template literal immediately, 
            // but we'll use style or specific class. Let's stick to standard palette for safety if hex fails, 
            // but JIT usually handles it. To be safe, let's use text-blue-900 which is close.
            // Actually, let's use text-blue-900.
            hoverBorder: "hover:border-blue-900",
            hoverShadow: "hover:shadow-blue-900/20"
        },
        {
            name: "Google Gemini",
            slug: "google-gemini",
            icon: <Sparkles className="w-10 h-10" />,
            color: "text-sky-500", // Gemini Blue
            hoverBorder: "hover:border-sky-500",
            hoverShadow: "hover:shadow-sky-500/20"
        },
        {
            name: "AWS Cloud",
            slug: "aws",
            icon: <Cloud className="w-10 h-10" />,
            color: "text-orange-500", // AWS Orange
            hoverBorder: "hover:border-orange-500",
            hoverShadow: "hover:shadow-orange-500/20"
        }
    ];

    return (
        <section id="platforms" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-secondary mb-4 font-sans">Platforms and Integrate</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded"></div>
                </div>

                {/* Software Platforms */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-secondary mb-8 text-center font-sans tracking-wide">SOFTWARE PLATFORMS</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center reveal">
                        {platforms.map((item, index) => (
                            <Link
                                key={index}
                                href={`/platforms/${item.slug}`}
                                className={`p-8 border border-gray-200 rounded-2xl shadow-md transition-all duration-300 group bg-white hover:-translate-y-2 ${item.hoverBorder} ${item.hoverShadow} hover:shadow-2xl relative overflow-hidden cursor-pointer block`}
                            >
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${item.color.replace('text-', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                <div className={`h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-gray-50 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white`}>
                                    <div className={`${item.color} transition-colors duration-300`}>
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="font-bold text-secondary font-sans transition-colors">{item.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Integrations */}
                <div>
                    <h3 className="text-xl font-bold text-secondary mb-8 text-center font-sans tracking-wide">INTEGRATIONS</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center reveal max-w-4xl mx-auto">
                        {integrations.map((item, index) => (
                            <Link
                                key={index}
                                href={`/integrations/${item.slug}`}
                                className={`p-8 border border-gray-200 rounded-2xl shadow-md transition-all duration-300 group bg-white hover:-translate-y-2 ${item.hoverBorder} ${item.hoverShadow} hover:shadow-2xl relative overflow-hidden block cursor-pointer`}
                            >
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${item.color.replace('text-', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                <div className={`h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-gray-50 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white`}>
                                    <div className={`${item.color} transition-colors duration-300`}>
                                        {item.icon}
                                    </div>
                                </div>
                                <h3 className="font-bold text-secondary font-sans transition-colors">{item.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
