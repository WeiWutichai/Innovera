
"use client";

import { useTransition, useState } from "react";
import { updatePost } from "../../actions";
import RichTextEditor from "../../../../components/RichTextEditor";

import { Save, ArrowLeft, Globe, Languages, Search, Image as ImageIcon, Type, Link as LinkIcon, Loader2 } from "lucide-react";

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    image: string | null;
    title_th: string | null;
    content_th: string | null;
    excerpt_th: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    metaTitle_th: string | null;
    metaDescription_th: string | null;
    metaKeywords_th: string | null;
}

export default function EditPostForm({ post }: { post: Post }) {
    const [isPending, startTransition] = useTransition();
    const [content, setContent] = useState(post.content);
    const [contentTh, setContentTh] = useState(post.content_th || "");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            try {
                await updatePost(post.id, formData);
            } catch (error) {
                console.error(error);
                alert("Failed to update post");
            }
        });
    };

    const sectionClass = "bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2";
    const inputClass = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-400";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className={sectionClass}>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">English Content</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className={labelClass}>
                            <Type className="w-4 h-4 text-gray-400" />
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={post.title}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="slug" className={labelClass}>
                            <LinkIcon className="w-4 h-4 text-gray-400" />
                            Slug
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            defaultValue={post.slug}
                            required
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="image" className={labelClass}>
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                        Image URL
                    </label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        defaultValue={post.image || ""}
                        className={inputClass}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label htmlFor="excerpt" className={labelClass}>
                        Excerpt
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        rows={3}
                        defaultValue={post.excerpt || ""}
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <div>
                    <label htmlFor="content" className={labelClass}>
                        Content
                    </label>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Write your content here..."
                        />
                    </div>
                    <input type="hidden" name="content" value={content} />
                </div>
            </div>

            {/* Thai Content Section */}
            <div className={sectionClass}>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Languages className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Thai Content (Optional)</h3>
                </div>

                <div>
                    <label htmlFor="title_th" className={labelClass}>
                        <Type className="w-4 h-4 text-gray-400" />
                        Thai Title
                    </label>
                    <input
                        type="text"
                        id="title_th"
                        name="title_th"
                        defaultValue={post.title_th || ""}
                        className={inputClass}
                        placeholder="Enter Thai title"
                    />
                </div>

                <div>
                    <label htmlFor="excerpt_th" className={labelClass}>
                        Thai Excerpt
                    </label>
                    <textarea
                        id="excerpt_th"
                        name="excerpt_th"
                        rows={3}
                        defaultValue={post.excerpt_th || ""}
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <div>
                    <label htmlFor="content_th" className={labelClass}>
                        Thai Content
                    </label>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <RichTextEditor
                            value={contentTh}
                            onChange={setContentTh}
                            placeholder="Write your Thai content here..."
                        />
                    </div>
                    <input type="hidden" name="content_th" value={contentTh} />
                </div>
            </div>

            {/* SEO Section */}
            <div className={sectionClass}>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">SEO Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* English SEO */}
                    <div className="space-y-4 pt-4 border-t border-gray-200 md:border-t-0">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                            English SEO
                        </h4>
                        <div>
                            <label htmlFor="metaTitle" className={labelClass}>Meta Title</label>
                            <input type="text" id="metaTitle" name="metaTitle" defaultValue={post.metaTitle || ""} className={inputClass} placeholder="Custom SEO Title" />
                        </div>
                        <div>
                            <label htmlFor="metaDescription" className={labelClass}>Meta Description</label>
                            <textarea id="metaDescription" name="metaDescription" rows={3} defaultValue={post.metaDescription || ""} className={`${inputClass} resize-none`} placeholder="Custom SEO Description" />
                        </div>
                        <div>
                            <label htmlFor="metaKeywords" className={labelClass}>Meta Keywords</label>
                            <input type="text" id="metaKeywords" name="metaKeywords" defaultValue={post.metaKeywords || ""} className={inputClass} placeholder="keyword1, keyword2" />
                        </div>
                    </div>

                    {/* Thai SEO */}
                    <div className="space-y-4 pt-8 border-t border-gray-200 md:pt-4 md:border-t-0 md:border-l md:pl-8">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            Thai SEO
                        </h4>
                        <div>
                            <label htmlFor="metaTitle_th" className={labelClass}>Meta Title (TH)</label>
                            <input type="text" id="metaTitle_th" name="metaTitle_th" defaultValue={post.metaTitle_th || ""} className={inputClass} placeholder="ชื่อเรื่อง SEO (ไทย)" />
                        </div>
                        <div>
                            <label htmlFor="metaDescription_th" className={labelClass}>Meta Description (TH)</label>
                            <textarea id="metaDescription_th" name="metaDescription_th" rows={3} defaultValue={post.metaDescription_th || ""} className={`${inputClass} resize-none`} placeholder="คำอธิบาย SEO (ไทย)" />
                        </div>
                        <div>
                            <label htmlFor="metaKeywords_th" className={labelClass}>Meta Keywords (TH)</label>
                            <input type="text" id="metaKeywords_th" name="metaKeywords_th" defaultValue={post.metaKeywords_th || ""} className={inputClass} placeholder="คำหลัก1, คำหลัก2" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-10 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 active:scale-95"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
