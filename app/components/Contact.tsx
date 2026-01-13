"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
    const { t } = useLanguage();

    return (
        <section id="contact" className="py-24 bg-secondary text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16">
                    <div className="reveal">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm font-sans">{t.contact.title}</span>
                        <h2 className="text-3xl lg:text-4xl font-extrabold mt-2 mb-6 font-sans">{t.contact.subtitle}</h2>
                        <p className="text-gray-400 mb-12 leading-relaxed font-sans">
                            {t.hero.description}
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1 font-sans">Address</h4>
                                    <p className="text-gray-400 font-sans">{t.contact.info.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1 font-sans">Email</h4>
                                    <p className="text-gray-400 font-sans">{t.contact.info.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1 font-sans">Phone</h4>
                                    <p className="text-gray-400 font-sans">{t.contact.info.phone}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#06C755]/20 rounded-lg flex items-center justify-center text-[#06C755] flex-shrink-0">
                                        <img src="/assets/contact-qr.png" alt="Line QR Code" className="w-full h-full object-cover rounded-lg mix-blend-overlay opacity-0 absolute" />
                                        {/* Using a chat icon or Line-ish SVG */}
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.83.5.83 4.66.83 9.79c0 4.63 4.09 8.5 9.4 9.17l-.5 3.03c-.05.3.2.53.47.41l4.94-2.82c5.96-.28 10.03-4.5 9.03-10-1.12-6.15-6.73-9.08-12.17-9.08z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1 font-sans">{t.contact.info.line}</h4>
                                        <div className="mt-2">
                                            <img src="/assets/contact-qr.png" alt="Line QR Code" className="w-32 h-32 rounded-lg border border-white/10" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#25D366]/20 rounded-lg flex items-center justify-center text-[#25D366] flex-shrink-0">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold mb-1 font-sans">{t.contact.info.whatsapp}</h4>
                                        <div className="mt-2">
                                            <img src="/assets/whatsapp-qr.png" alt="WhatsApp QR Code" className="w-32 h-32 rounded-lg border border-white/10" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 reveal">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2 font-sans">Name</label>
                                    <input type="text" className="w-full bg-dark border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-primary text-white font-sans" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 font-sans">Email</label>
                                    <input type="email" className="w-full bg-dark border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-primary text-white font-sans" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 font-sans">Company</label>
                                <input type="text" className="w-full bg-dark border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-primary text-white font-sans" placeholder="Company Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 font-sans">Message</label>
                                <textarea rows={12} className="w-full bg-dark border border-gray-700 rounded px-4 py-3 focus:outline-none focus:border-primary text-white font-sans" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded hover:bg-primary-hover transition shadow-lg uppercase tracking-wide text-sm font-sans">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
