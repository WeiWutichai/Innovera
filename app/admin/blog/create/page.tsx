
"use client";

import { useTransition, useState } from "react";
import { createPost } from "../actions";
import RichTextEditor from "../../../components/RichTextEditor";
import { ArrowLeft, FileText, Globe } from "lucide-react";
import Link from "next/link";

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
        <div className="font-sans">
            <div className="max-w-4xl mx-auto">
                <Link href="/admin/blog" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                        <p className="text-gray-500 text-sm">Fill in the details below to create a new blog post</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-indigo-500" />
                            English Content
                        </h2>

                        {/* Title */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                placeholder="Enter post title"
                            />
                        </div>

                        {/* Slug */}
                        <div className="mb-4">
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                Slug
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                placeholder="enter-post-slug"
                            />
                        </div>

                        {/* Image URL */}
                        <div className="mb-4">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                Image URL
                            </label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="mb-4">
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                placeholder="Brief summary of the post..."
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                            </label>
                            <RichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="Write your content here..."
                            />
                            <input type="hidden" name="content" value={content} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            🇹🇭 Thai Content (Optional)
                        </h2>

                        {/* Thai Title */}
                        <div className="mb-4">
                            <label htmlFor="title_th" className="block text-sm font-medium text-gray-700 mb-2">
                                Thai Title
                            </label>
                            <input
                                type="text"
                                id="title_th"
                                name="title_th"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                placeholder="Enter Thai title"
                            />
                        </div>

                        {/* Thai Excerpt */}
                        <div className="mb-4">
                            <label htmlFor="excerpt_th" className="block text-sm font-medium text-gray-700 mb-2">
                                Thai Excerpt
                            </label>
                            <textarea
                                id="excerpt_th"
                                name="excerpt_th"
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                placeholder="Brief summary of the post in Thai..."
                            />
                        </div>

                        {/* Thai Content */}
                        <div>
                            <label htmlFor="content_th" className="block text-sm font-medium text-gray-700 mb-2">
                                Thai Content
                            </label>
                            <RichTextEditor
                                value={contentTh}
                                onChange={setContentTh}
                                placeholder="Write your Thai content here..."
                            />
                            <input type="hidden" name="content_th" value={contentTh} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* English SEO */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">English SEO</h4>
                                <div>
                                    <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                                    <input type="text" id="metaTitle" name="metaTitle" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="Custom SEO Title" />
                                </div>
                                <div>
                                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                                    <textarea id="metaDescription" name="metaDescription" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="Custom SEO Description" />
                                </div>
                                <div>
                                    <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                                    <input type="text" id="metaKeywords" name="metaKeywords" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="keyword1, keyword2" />
                                </div>
                            </div>

                            {/* Thai SEO */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Thai SEO</h4>
                                <div>
                                    <label htmlFor="metaTitle_th" className="block text-sm font-medium text-gray-700 mb-2">Meta Title (TH)</label>
                                    <input type="text" id="metaTitle_th" name="metaTitle_th" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="ชื่อเรื่อง SEO (ไทย)" />
                                </div>
                                <div>
                                    <label htmlFor="metaDescription_th" className="block text-sm font-medium text-gray-700 mb-2">Meta Description (TH)</label>
                                    <textarea id="metaDescription_th" name="metaDescription_th" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="คำอธิบาย SEO (ไทย)" />
                                </div>
                                <div>
                                    <label htmlFor="metaKeywords_th" className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords (TH)</label>
                                    <input type="text" id="metaKeywords_th" name="metaKeywords_th" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="คำหลัก1, คำหลัก2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25"
                        >
                            {isPending ? "Creating..." : "Create Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
