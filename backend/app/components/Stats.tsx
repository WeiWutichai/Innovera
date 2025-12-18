
"use client";
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function Stats() {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, 0, 224);
                gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)'); // Sky blue
                gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Cycle Time',
                            data: [12, 10, 8, 14, 6, 9, 7], // Dummy data matching the curve shape
                            borderColor: 'rgba(56, 189, 248, 0.9)',
                            backgroundColor: gradient,
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0,
                            pointHoverRadius: 4,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                                backgroundColor: 'rgba(28, 25, 23, 0.9)',
                                titleColor: '#fff',
                                bodyColor: '#cbd5e1',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderWidth: 1
                            }
                        },
                        scales: {
                            x: {
                                display: true,
                                grid: { display: false },
                                ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }
                            },
                            y: {
                                display: true,
                                grid: {
                                    color: 'rgba(255,255,255,0.05)',
                                },
                                ticks: { display: false }
                            }
                        }
                    }
                });
            }
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <section id="insights" className="max-w-7xl mx-auto px-6 mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Chart Card */}
                <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
                    <h3 className="text-xl font-semibold tracking-tight font-nunito text-white">Cycle time</h3>
                    <p className="text-sm text-white/70 mb-4 font-nunito">Median hours from start to done across active teams.</p>
                    {/* Wrap canvas in a div to avoid growth bug */}
                    <div className="rounded-xl border border-white/10 bg-stone-950/40 p-3 h-64">
                        <div className="w-full h-full">
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                            <p className="text-xs text-white/60 font-nunito">This week</p>
                            <p className="text-base font-semibold tracking-tight font-nunito text-white">7.4h</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                            <p className="text-xs text-white/60 font-nunito">Change</p>
                            <p className="text-base font-semibold tracking-tight text-red-400 font-nunito">-11%</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                            <p className="text-xs text-white/60 font-nunito">P90</p>
                            <p className="text-base font-semibold tracking-tight font-nunito text-white">18.2h</p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                            <p className="text-xs text-white/60 font-nunito">Throughput</p>
                            <p className="text-base font-semibold tracking-tight font-nunito text-white">142/wk</p>
                        </div>
                    </div>
                </div>

                {/* Insight bullets */}
                <div className="lg:col-span-5 md:p-8 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4dcbc3ae-9030-4976-b771-f70080b92f09_1600w.jpg)] bg-cover border-white/10 rounded-3xl pt-6 pr-6 pb-6 pl-6">
                    <h3 className="text-xl font-semibold tracking-tight font-nunito text-white">Where time goes</h3>
                    <p className="text-sm text-white/70 font-nunito">Understand the bottlenecks and fix them with intention.</p>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-white">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 border border-white/10">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <path d="M7 10l5 5 5-5"></path>
                                    <path d="M12 15V3"></path>
                                </svg>
                            </span>
                            <div>
                                <p className="text-sm font-medium tracking-tight font-nunito">Handoffs</p>
                                <p className="text-xs text-white/60 font-nunito">Reduce idle time with auto-assign and single-owner tasks.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-white">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 border border-white/10">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 6v6l4 2"></path>
                                </svg>
                            </span>
                            <div>
                                <p className="text-sm font-medium tracking-tight font-nunito">Waiting on review</p>
                                <p className="text-xs text-white/60 font-nunito">Set SLAs for PR reviews and auto-remind owners.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-white">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 border border-white/10">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3h18v7H3z"></path>
                                    <path d="M8 21h8"></path>
                                    <path d="M12 10v11"></path>
                                </svg>
                            </span>
                            <div>
                                <p className="text-sm font-medium tracking-tight font-nunito">QA and validation</p>
                                <p className="text-xs text-white/60 font-nunito">Environments spin up automatically for each branch.</p>
                            </div>
                        </div>
                        <a href="#" className="inline-flex items-center text-sm text-white/80 hover:text-white mt-1 font-nunito">
                            Explore analytics
                            <svg width="16" height="16" viewBox="0 0 24 24" className="ml-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="M12 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
