'use client';

import { useState } from "react";
import { assignProductToUser, removeProductFromUser, assignAllProductsToUser } from "@/app/actions/admin";

interface Product {
    id: string;
    name: string;
}

interface UserProductManagerProps {
    userId: number;
    assignedProducts: Product[];
    allProducts: Product[];
}

export default function UserProductManager({ userId, assignedProducts, allProducts }: UserProductManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState("");

    const handleAdd = async () => {
        if (!selectedProductId) return;

        if (selectedProductId === 'ALL') {
            await assignAllProductsToUser(userId);
        } else {
            await assignProductToUser(userId, selectedProductId);
        }

        setIsAdding(false);
        setSelectedProductId("");
    };

    const handleRemove = async (productId: string) => {
        if (confirm("Remove this product from user?")) {
            await removeProductFromUser(userId, productId);
        }
    };

    const availableProducts = allProducts.filter(
        p => !assignedProducts.some(ap => ap.id === p.id)
    );

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {assignedProducts.map(product => (
                <span key={product.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100 shadow-sm transition-all hover:bg-indigo-100 group">
                    {product.name}
                    <button
                        onClick={() => handleRemove(product.id)}
                        className="text-indigo-400 hover:text-red-500 transition-colors"
                        title="Remove product"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </span>
            ))}

            {isAdding ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    >
                        <option value="">Select Product...</option>
                        <option value="ALL">All Products</option>
                        {availableProducts.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        disabled={!selectedProductId}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                        title="Confirm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button
                        onClick={() => setIsAdding(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 shadow-sm transition-all"
                        title="Cancel"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ) : availableProducts.length > 0 && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-indigo-600 hover:text-white text-xs font-bold px-4 py-1.5 rounded-lg border-2 border-indigo-500/10 hover:bg-indigo-500 hover:border-indigo-500 transition-all flex items-center gap-1.5"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Product
                </button>
            )}
        </div>
    );
}
