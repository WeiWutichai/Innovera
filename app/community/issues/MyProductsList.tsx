"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Product {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
}

export default function MyProductsList({
    products,
    notificationCounts = {}
}: {
    products: Product[];
    notificationCounts?: Record<string, number>;
}) {
    const router = useRouter();

    // Auto-refresh logic: refresh data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [router]);
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
                const unreadCount = notificationCounts[product.id] || 0;

                return (
                    <div key={product.id} className="group relative h-full">
                        <div className="relative h-full bg-white rounded-2xl border border-[#E6E8F0] shadow-[0_12px_32px_rgba(99,102,241,0.08)] overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col border-t-[4px] border-t-[#6366F1]">

                            <div className="p-6 flex flex-col h-full">
                                {/* Header: Icon + Badge */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center border border-[#E0E7FF]">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-8 h-8 object-contain rounded-lg" />
                                        ) : (
                                            <svg className="w-7 h-7 text-[#6366F1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        )}
                                    </div>

                                    {unreadCount > 0 && (
                                        <div className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full border border-red-100 shadow-sm flex items-center gap-1.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            {unreadCount > 9 ? '9+' : unreadCount} New
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-[#6366F1] mb-2 leading-tight">
                                        {product.name}
                                    </h3>
                                    <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-2">
                                        {product.description || "No description available for this product."}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-auto space-y-3">
                                    <Link
                                        href={`/community/products/${product.id}`}
                                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#F4F5FF] text-[#4F46E5] border border-[#E0E3FF] text-sm font-semibold hover:bg-[#EEF2FF] transition-all group/link"
                                    >
                                        <span>View Documentation</span>
                                        <svg className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </Link>

                                    <Link
                                        href={`/community/issues/product/${product.id}`}
                                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-br from-[#111827] to-[#1F2937] text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-lg shadow-gray-900/10 hover:shadow-gray-900/10 hover:to-[#374151] hover:-translate-y-0.5 transition-all active:scale-[0.98]"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                        Report / View Issues
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {products.length === 0 && (
                <div className="col-span-full py-16 text-center">
                    <div className="bg-white rounded-3xl p-12 max-w-lg mx-auto border border-gray-100 shadow-xl shadow-indigo-50/50">
                        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                        <p className="text-gray-500">You don't have any products assigned to you yet.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
