"use client";

import { useEffect, useRef, useState } from "react";
import { createIssue } from "@/app/actions/issue";
import { uploadImage } from "@/app/actions/upload";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/app/components/RichTextEditor";
import { sanitizeClientHtml } from "@/lib/sanitize-client";

interface Product {
    id: string;
    name: string;
}

function getHtmlText(html: string) {
    if (typeof document === "undefined") {
        return html.replace(/<[^>]*>/g, "");
    }

    const element = document.createElement("div");
    element.innerHTML = html;
    return element.textContent || "";
}

function hasRichTextContent(html: string) {
    return getHtmlText(html).trim().length > 0 || /<img[\s>]/i.test(html);
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
    const previewsRef = useRef<string[]>([]);
    const [previewLightboxIndex, setPreviewLightboxIndex] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const descriptionTextLength = getHtmlText(description).trim().length;

    useEffect(() => {
        previewsRef.current = previews;
    }, [previews]);

    useEffect(() => {
        return () => {
            previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

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
            e.target.value = "";
        }
    }

    function removeImage(index: number) {
        URL.revokeObjectURL(previews[index]);
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setPreviewLightboxIndex(current => {
            if (current === null) return null;
            if (current === index) return null;
            if (current > index) return current - 1;
            return current;
        });
    }

    async function uploadEditorImage(file: File) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        return uploadImage(uploadFormData);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setUploading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const sanitizedDescription = sanitizeClientHtml(description);

        // Basic validation
        if (!hasRichTextContent(sanitizedDescription)) {
            setError("Description is required");
            setLoading(false);
            setUploading(false);
            return;
        }

        if (sanitizedDescription.length > 10000) {
            setError("Description is too long");
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
                description: sanitizedDescription,
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

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit issue");
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
                            <span className="text-xs text-gray-400">
                                {descriptionTextLength} chars
                            </span>
                        </div>
                        <RichTextEditor
                            value={description}
                            onChange={setDescription}
                            placeholder="Detailed description of the problem..."
                            minHeight="220px"
                            onImageUpload={uploadEditorImage}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Attachments (Max 6)</label>
                        <div className="flex flex-wrap gap-4">
                            {previews.map((src, index) => (
                                <div key={src} className="relative w-24 h-24 rounded border border-gray-200 overflow-hidden group">
                                    <button
                                        type="button"
                                        onClick={() => setPreviewLightboxIndex(index)}
                                        className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-[#4B286D]"
                                        aria-label={`Preview attachment ${index + 1}`}
                                    >
                                        <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            Zoom
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            removeImage(index);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm"
                                        aria-label={`Remove attachment ${index + 1}`}
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

            {previewLightboxIndex !== null && previews[previewLightboxIndex] && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2"
                    onClick={() => setPreviewLightboxIndex(null)}
                >
                    <button
                        type="button"
                        onClick={() => setPreviewLightboxIndex(null)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                        aria-label="Close image preview"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {previews.length > 1 && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                setPreviewLightboxIndex((previewLightboxIndex - 1 + previews.length) % previews.length);
                            }}
                            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
                            aria-label="Previous attachment"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                    )}

                    <div
                        className="flex h-[94vh] w-[98vw] items-center justify-center"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={previews[previewLightboxIndex]}
                            alt={`Attachment preview ${previewLightboxIndex + 1}`}
                            className="h-full w-full object-contain shadow-2xl"
                        />
                    </div>

                    {previews.length > 1 && (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                setPreviewLightboxIndex((previewLightboxIndex + 1) % previews.length);
                            }}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
                            aria-label="Next attachment"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    )}

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-white/10 px-4 py-2 rounded-full">
                        {previewLightboxIndex + 1} / {previews.length}
                    </div>
                </div>
            )}
        </div>
    );
}
