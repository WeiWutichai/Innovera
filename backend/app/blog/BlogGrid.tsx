
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext";

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image: string | null;
    createdAt: Date;
    title_th: string | null;
    content_th: string | null;
    excerpt_th: string | null;
}

export default function BlogGrid({ posts }: { posts: Post[] }) {
    const { language } = useLanguage();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
                // Determine content based on language
                const isThai = language === 'th';
                const title = (isThai && post.title_th) ? post.title_th : post.title;
                const excerpt = (isThai && post.excerpt_th) ? post.excerpt_th : post.excerpt;
                // Simple read time estimation (very rough for Thai)
                const contentForReadTime = (isThai && post.content_th) ? post.content_th : post.content;
                const readTime = Math.ceil((contentForReadTime?.length || 0) / 1000);

                return (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col bg-[#1A1D21] rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-300 border border-white/5 shadow-2xl h-full"
                    >
                        {/* Image Container */}
                        <div className="h-64 w-full bg-white p-8 flex items-center justify-center relative overflow-hidden">
                            {post.image ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={post.image}
                                        alt={title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-grow bg-gradient-to-b from-[#1A1D21] to-[#0d0f12]">
                            <div className="flex items-center gap-3 text-xs font-bold text-pink-500 mb-4 uppercase tracking-widest">
                                <time dateTime={post.createdAt.toISOString()}>
                                    {new Date(post.createdAt).toLocaleDateString(isThai ? "th-TH" : "en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    })}
                                </time>
                                <span className="w-1 h-1 rounded-full bg-pink-500"></span>
                                <span>{readTime} {isThai ? "นาทีอ่าน" : "min read"}</span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-pink-400 transition-colors">
                                {title}
                            </h3>

                            <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                {excerpt || "No excerpt available."}
                            </p>

                            <div className="flex items-center text-sm font-bold text-white group-hover:text-pink-400 transition-colors mt-auto tracking-wide">
                                {isThai ? "อ่านต่อ" : "Read more"}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
