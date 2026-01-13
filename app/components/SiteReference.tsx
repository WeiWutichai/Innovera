"use client";
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SiteReference() {
    const [showAll, setShowAll] = useState(false);

    const stories = [
        {
            id: 1,
            name: "MaxTech Elevator & Services",
            logo: "/images/maxtech_logo.png",
            tag: "ENGINEERING",
            tagColor: "bg-red-600",
            desc: "ยกระดับมาตรฐานบริการลิฟต์ด้วยเทคโนโลยี IoT และระบบติดตามการทำงานแบบเรียลไทม์",
            imgClass: ""
        },
        {
            id: 2,
            name: "P.C. Tuna Siam",
            logo: "/images/pctuna_logo.png",
            tag: "FOOD INDUSTRY",
            tagColor: "bg-blue-600",
            desc: "เพิ่มประสิทธิภาพการผลิตอาหารทะเลกระป๋องด้วยระบบอัตโนมัติและการจัดการข้อมูลที่แม่นยำ",
            imgClass: "p-2"
        },
        {
            id: 3,
            name: "Almendra",
            logo: "/images/almendra_logo.png",
            tag: "FOOD INNOVATION",
            tagColor: "bg-green-600",
            desc: "นวัตกรรมการลดน้ำตาลในอาหารเพื่อสุขภาพ ขับเคลื่อนด้วยการวิจัยและเทคโนโลยีทันสมัย",
            imgClass: ""
        },
        {
            id: 4,
            name: "Duro",
            logo: "/images/duro_logo.png",
            tag: "MANUFACTURING",
            tagColor: "bg-orange-600",
            desc: "เพิ่มขีดความสามารถในการผลิตยางและชิ้นส่วนยานยนต์ด้วยโซลูชันการจัดการโรงงานอัจฉริยะ",
            imgClass: "p-4"
        }
    ];

    const visibleStories = showAll ? stories : stories.slice(0, 3);

    return (
        <section id="site-reference" className="py-24 bg-secondary text-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 font-sans">Customer Success Stories</h2>
                        <p className="text-gray-400 max-w-xl font-sans">See how leading companies are transforming their business with Innovera.</p>
                    </div>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="hidden md:inline-block px-6 py-3 border border-gray-600 rounded hover:bg-gray-800 transition text-sm font-bold tracking-wide uppercase font-sans"
                    >
                        {showAll ? "SHOW LESS" : "VIEW ALL STORIES"}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
                    {visibleStories.map((story) => (
                        <div key={story.id} className="bg-white/5 rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-primary transition duration-300">
                            <div className="relative h-48 p-8 flex items-center justify-center bg-white">
                                <img
                                    src={story.logo}
                                    alt={story.name}
                                    className={`w-full h-full object-contain group-hover:scale-105 transition duration-300 ${story.imgClass}`}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className={`${story.tagColor} text-white text-[10px] font-bold px-2 py-1 rounded-full font-sans tracking-wide`}>
                                        {story.tag}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition font-sans text-white">{story.name}</h3>
                                <p className="text-gray-400 text-sm mb-4 font-thai">{story.desc}</p>
                                <span className="text-sm font-bold border-b border-primary pb-0.5 group-hover:text-primary transition font-sans text-white">Read Success Story</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-8 text-center md:hidden">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="px-6 py-3 border border-gray-600 rounded hover:bg-gray-800 transition text-sm font-bold tracking-wide uppercase font-sans text-white"
                    >
                        {showAll ? "SHOW LESS" : "VIEW ALL STORIES"}
                    </button>
                </div>
            </div>
        </section>
    );
}
