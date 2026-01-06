
"use client";

import { useTransition, useState } from "react";
import { createPost } from "../actions";
import RichTextEditor from "../../../components/RichTextEditor";

export default function CreatePostPage() {
    const [isPending, startTransition] = useTransition();
    const [content, setContent] = useState("");
    const [contentTh, setContentTh] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
            try {
                await createPost(formData);
            } catch (error) {
                console.error(error);
                alert("Failed to create post");
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] p-8 font-nunito">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Create New Post</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Enter post title"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-400 mb-2">
                            Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            required
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="enter-post-slug"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-400 mb-2">
                            Image URL
                        </label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-400 mb-2">
                            Excerpt
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            rows={3}
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Brief summary of the post..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">
                            Content
                        </label>
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Write your content here..."
                        />
                        <input type="hidden" name="content" value={content} />
                    </div>

                    <hr className="border-white/10 my-8" />
                    <h3 className="text-xl font-bold text-white mb-6">Thai Content (Optional)</h3>

                    {/* Thai Title */}
                    <div>
                        <label htmlFor="title_th" className="block text-sm font-medium text-gray-400 mb-2">
                            Thai Title
                        </label>
                        <input
                            type="text"
                            id="title_th"
                            name="title_th"
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Enter Thai title"
                        />
                    </div>

                    {/* Thai Excerpt */}
                    <div>
                        <label htmlFor="excerpt_th" className="block text-sm font-medium text-gray-400 mb-2">
                            Thai Excerpt
                        </label>
                        <textarea
                            id="excerpt_th"
                            name="excerpt_th"
                            rows={3}
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="Brief summary of the post in Thai..."
                        />
                    </div>

                    {/* Thai Content */}
                    <div>
                        <label htmlFor="content_th" className="block text-sm font-medium text-gray-400 mb-2">
                            Thai Content
                        </label>
                        <RichTextEditor
                            value={contentTh}
                            onChange={setContentTh}
                            placeholder="Write your Thai content here..."
                        />
                        <input type="hidden" name="content_th" value={contentTh} />
                    </div>

                    <hr className="border-white/10 my-8" />
                    <h3 className="text-xl font-bold text-white mb-6">SEO Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* English SEO */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-300">English SEO</h4>
                            <div>
                                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-400 mb-2">Meta Title</label>
                                <input type="text" id="metaTitle" name="metaTitle" className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Custom SEO Title" />
                            </div>
                            <div>
                                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-400 mb-2">Meta Description</label>
                                <textarea id="metaDescription" name="metaDescription" rows={3} className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Custom SEO Description" />
                            </div>
                            <div>
                                <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-400 mb-2">Meta Keywords</label>
                                <input type="text" id="metaKeywords" name="metaKeywords" className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="keyword1, keyword2" />
                            </div>
                        </div>

                        {/* Thai SEO */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-300">Thai SEO</h4>
                            <div>
                                <label htmlFor="metaTitle_th" className="block text-sm font-medium text-gray-400 mb-2">Meta Title (TH)</label>
                                <input type="text" id="metaTitle_th" name="metaTitle_th" className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="ชื่อเรื่อง SEO (ไทย)" />
                            </div>
                            <div>
                                <label htmlFor="metaDescription_th" className="block text-sm font-medium text-gray-400 mb-2">Meta Description (TH)</label>
                                <textarea id="metaDescription_th" name="metaDescription_th" rows={3} className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="คำอธิบาย SEO (ไทย)" />
                            </div>
                            <div>
                                <label htmlFor="metaKeywords_th" className="block text-sm font-medium text-gray-400 mb-2">Meta Keywords (TH)</label>
                                <input type="text" id="metaKeywords_th" name="metaKeywords_th" className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="คำหลัก1, คำหลัก2" />
                            </div>
                        </div>
                    </div>

                    <hr className="border-white/10 my-8" />
                    <h3 className="text-xl font-bold text-white mb-6">SEO Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* English SEO */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-300">English SEO</h4>
                            <div>
                                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-400 mb-2">Meta Title</label>
                                <input type="text" id="metaTitle" name="metaTitle" className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Custom SEO Title" />
                            </div>
                            <div>
                                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-400 mb-2">Meta Description</label>
                                <textarea id="metaDescription" name="metaDescription" rows={3} className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Custom SEO Description" />
                            </div>
                            <div>
                                <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-400 mb-2">Meta Keywords</label>
                                <input type="text" id="metaKeywords" name="metaKeywords" className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="keyword1, keyword2" />
                            </div>
                        </div>

                        {/* Thai SEO */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-300">Thai SEO</h4>
                            <div>
                                <label htmlFor="metaTitle_th" className="block text-sm font-medium text-gray-400 mb-2">Meta Title (TH)</label>
                                <input type="text" id="metaTitle_th" name="metaTitle_th" className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="ชื่อเรื่อง SEO (ไทย)" />
                            </div>
                            <div>
                                <label htmlFor="metaDescription_th" className="block text-sm font-medium text-gray-400 mb-2">Meta Description (TH)</label>
                                <textarea id="metaDescription_th" name="metaDescription_th" rows={3} className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="คำอธิบาย SEO (ไทย)" />
                            </div>
                            <div>
                                <label htmlFor="metaKeywords_th" className="block text-sm font-medium text-gray-400 mb-2">Meta Keywords (TH)</label>
                                <input type="text" id="metaKeywords_th" name="metaKeywords_th" className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="คำหลัก1, คำหลัก2" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors disabled:opacity-50"
                        >
                            {isPending ? "Creating..." : "Create Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
