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
                <span key={product.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 text-xs text-gray-300 border border-white/5">
                    {product.name}
                    <button
                        onClick={() => handleRemove(product.id)}
                        className="hover:text-red-400 transition-colors"
                    >
                        &times;
                    </button>
                </span>
            ))}

            {isAdding ? (
                <div className="flex items-center gap-2">
                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="bg-[#0F172A] border border-white/10 rounded px-2 py-1 text-xs text-white outline-none"
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
                        className="text-green-400 hover:text-green-300 disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button
                        onClick={() => setIsAdding(false)}
                        className="text-red-400 hover:text-red-300"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ) : availableProducts.length > 0 && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
                >
                    + Add
                </button>
            )}
        </div>
    );
}
