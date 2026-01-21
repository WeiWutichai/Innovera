"use client";

import { useState } from "react";
import { createIssue } from "@/app/actions/issue";
import { uploadImage } from "@/app/actions/upload";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
}

export default function IssueFormModal({
    product,
    onClose
}: {
    product: Product;
    onClose: () => void;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [description, setDescription] = useState("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (selectedImages.length + files.length > 6) {
                setError("You can only upload a maximum of 6 images.");
                return;
            }
            setError("");
            setSelectedImages(prev => [...prev, ...files]);

            // Create previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    }

    function removeImage(index: number) {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setUploading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;

        // Basic validation
        if (!description.trim()) {
            setError("Description is required");
            setLoading(false);
            setUploading(false);
            return;
        }

        try {
            // 1. Upload images
            const imageUrls: string[] = [];
            for (const image of selectedImages) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', image);
                const url = await uploadImage(uploadFormData);
                imageUrls.push(url);
            }

            // 2. Create Issue
            await createIssue({
                title,
                description,
                productId: product.id,
                imageUrls
            });

            // Refresh the page data to show the new issue
            router.refresh();

            // Success handling
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000); // Close after 2 seconds

        } catch (err: any) {
            setError(err.message || "Failed to submit issue");
            setLoading(false);
            setUploading(false); // Only stop uploading state on error
        } finally {
            // Don't optimize validation here, wait for success or error
        }
    }

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
                    <p className="text-gray-600">Your issue has been reported successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="bg-[#4B286D] p-6 text-white flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Report a New Issue</h2>
                        <p className="text-purple-200 text-xs mt-1">For: {product.name}</p>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow custom-scrollbar">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Issue Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            className="w-full border-2 border-gray-100 rounded p-2 focus:border-[#4B286D] outline-none transition text-black"
                            placeholder="Brief summary of the issue"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-bold text-gray-700">Description</label>
                            <span className={`text-xs ${description.length >= 250 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                {description.length}/250
                            </span>
                        </div>
                        <textarea
                            name="description"
                            required
                            rows={8}
                            maxLength={250}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[#4B286D] outline-none transition resize-none text-gray-900"
                            placeholder="Detailed description of the problem (max 250 characters)..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Attachments (Max 6)</label>
                        <div className="flex flex-wrap gap-4">
                            {previews.map((src, index) => (
                                <div key={index} className="relative w-24 h-24 rounded border border-gray-200 overflow-hidden group">
                                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}

                            {selectedImages.length < 6 && (
                                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-[#4B286D] hover:bg-purple-50 transition text-gray-400 hover:text-[#4B286D]">
                                    <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <span className="text-[10px] font-bold">Add Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-600 font-bold rounded hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-red-600 text-white py-2 px-4 font-bold rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    {uploading ? "Uploading..." : "Submitting..."}
                                </>
                            ) : "Submit Issue"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
