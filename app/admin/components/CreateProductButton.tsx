"use client";

import { useState } from "react";
import { createProduct } from "@/app/actions/product";

export default function CreateProductButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const image = formData.get('image') as string;

        if (!name) {
            setIsSubmitting(false);
            return;
        }

        await createProduct({ name, description, image });
        setIsSubmitting(false);
        setIsOpen(false);
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-blue-900/20"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Product
            </button>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-blue-900/20"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create Product
            </button>

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-[#1E293B] rounded-xl border border-white/10 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Create New Product</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form action={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                autoFocus
                                className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. Enterprise Suite"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Brief description of the product..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Image URL</label>
                            <input
                                type="text"
                                name="image"
                                className="w-full bg-[#0F172A] border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    "Create Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
