"use client";
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ServiceModal from './ServiceModal';

export default function Features() {
    const { t } = useLanguage();
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeService, setActiveService] = useState<string>('webDesign');

    const handleOpenModal = (key: string) => {
        const serviceData = t.features.cards[key as keyof typeof t.features.cards];
        setSelectedService(serviceData);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const services = [
        {
            key: 'webDesign',
            icon: (
                <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="21" y2="9" />
                </svg>
            ),
        },
        {
            key: 'mobileApp',
            icon: (
                <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                    <path d="M12 18h.01" />
                </svg>
            ),
        },
        {
            key: 'digitalMarketing',
            icon: (
                <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                </svg>
            ),
        },
        {
            key: 'graphicDesign',
            icon: (
                <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="13.5" cy="6.5" r=".5" />
                    <circle cx="17.5" cy="10.5" r=".5" />
                    <circle cx="8.5" cy="7.5" r=".5" />
                    <circle cx="6.5" cy="12.5" r=".5" />
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
            ),
        },
        {
            key: 'cloudSolutions',
            icon: (
                <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19" />
                    <path d="M22 19a5 5 0 0 0-5-5h-.5" />
                    <path d="M2 19a5 5 0 0 1 5-5h.5" />
                    <path d="M12 9a6 6 0 0 1 6 6" />
                    <path d="M6 15A6.002 6.002 0 0 1 12 9" />
                </svg>
            ),
        },
        {
            key: 'itConsultant',
            icon: (
                <svg className="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
        }
    ] as const;

    return (
        <section id="services" className="py-24 bg-gray-50 relative">
            {/* Decoration Line */}
            <div className="absolute left-0 top-1/2 w-full h-px bg-gray-200 -z-0 hidden md:block"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 reveal">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm font-sans">Our Capabilities</span>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-secondary mt-2 font-sans">Services & Solutions</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 reveal">
                    {services.map((service, index) => (
                        <div
                            key={service.key}
                            onMouseEnter={() => setActiveService(service.key)}
                            className={`bg-white p-8 rounded shadow-lg border-t-4 ${activeService === service.key ? 'border-primary shadow-2xl scale-105' : 'border-secondary'} hover:border-primary transition-all duration-300 group flex flex-col h-full`}
                        >
                            <div className="mb-6 bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-secondary font-sans">
                                {t.features.cards[service.key].title}
                            </h3>
                            <p className="text-gray-600 mb-6 leading-relaxed text-sm font-thai min-h-[40px] flex-grow">
                                {t.features.cards[service.key].desc}
                            </p>
                            <button
                                onClick={() => handleOpenModal(service.key)}
                                className="text-primary font-bold text-sm hover:underline flex items-center gap-1 font-sans cursor-pointer focus:outline-none mt-auto"
                            >
                                READ MORE
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Details Modal */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                service={selectedService}
            />
        </section>
    );
}
