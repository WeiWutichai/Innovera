"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function FAQ() {
    const { t } = useLanguage();

    return (
        <section className="max-w-7xl mx-auto px-6 mt-16 pb-16">
            <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl tracking-tight font-nunito font-semibold text-white">{t.faq.title}</h3>
                <p className="text-white/70 mt-2 font-nunito">{t.faq.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {t.faq.items.map((item, index) => (
                    <div key={index} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <h4 className="font-medium tracking-tight mb-2 font-nunito text-white">{item.q}</h4>
                        <p className="text-sm text-white/70 font-nunito">{item.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
