"use client";

import Link from "next/link";

interface Product {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
}

export default function MyProductsList({ products }: { products: Product[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <div key={product.id} className="block group h-full">
                    <div className="bg-[#F3EBF6] hover:bg-[#ebdcf0] rounded-none p-6 transition-colors h-full flex flex-col min-h-[200px] relative">
                        <div className="mb-4 flex justify-between items-start">
                            <span className="bg-[#785484] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                                PRODUCT
                            </span>
                            <Link href={`/community/products/${product.id}`} className="text-[#4B286D] hover:underline text-xs font-semibold">
                                View Docs &rarr;
                            </Link>
                        </div>
                        <h3 className="text-xl font-bold text-[#4B286D] mb-3 line-clamp-2">
                            {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                            {product.description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-purple-200">
                            <Link
                                href={`/community/issues/product/${product.id}`}
                                className="w-full bg-[#4B286D] text-white py-2 px-4 text-sm font-bold hover:bg-[#3a1f55] transition flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Views Issue
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
            {products.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded text-gray-500">
                    No products assigned to you yet.
                </div>
            )}
        </div>
    );
}
