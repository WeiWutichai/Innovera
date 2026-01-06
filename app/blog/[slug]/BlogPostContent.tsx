
"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string | null;
    createdAt: Date;
    author: {
        name: string | null;
        image: string | null;
    };
    title_th: string | null;
    content_th: string | null;
}

interface BlogPostContentProps {
    post: Post;
    otherPosts: any[];
}

export default function BlogPostContent({ post, otherPosts }: BlogPostContentProps) {
    const { language } = useLanguage();
    const isThai = language === 'th';

    const title = (isThai && post.title_th) ? post.title_th : post.title;
    const content = (isThai && post.content_th) ? post.content_th : post.content;

    return (
        <div className="flex-grow pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
            {/* Back Link */}
            <Link
                href="/blog"
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 group"
            >
                <svg
                    className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                {isThai ? "ย้อนกลับ" : "Back to Blog"}
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content - Left Column */}
                <article className="lg:col-span-8">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {title}
                        </h1>

                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                                {post.author.image ? (
                                    <Image
                                        src={post.author.image}
                                        alt={post.author.name || "Author"}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                                        {(post.author.name?.[0] || "A").toUpperCase()}
                                    </div>
                                )}
                                <span className="font-medium text-white">
                                    {post.author.name || "Unknown Author"}
                                </span>
                            </div>
                            <span>•</span>
                            <time dateTime={post.createdAt.toISOString()}>
                                {new Date(post.createdAt).toLocaleDateString(isThai ? "th-TH" : "en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.image && (
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 border border-white/10">
                            <Image
                                src={post.image}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-white prose-li:text-white prose-a:text-pink-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-pink-300 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 [&>div>p]:text-white [&>div>ul>li]:text-white [&>div>ol>li]:text-white [&_strong]:text-white [&_span]:text-white">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </article>

                {/* Sidebar - Right Column */}
                <aside className="lg:col-span-4 space-y-8">
                    {/* Other Posts Component */}
                    <div className="bg-[#1A1D21] rounded-2xl p-6 border border-white/5">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                            {isThai ? "กำลังเป็นที่นิยม" : "Trending Posts"}
                        </h3>
                        <div className="flex flex-col gap-6">
                            {otherPosts.map((other) => {
                                const otherTitle = (isThai && other.title_th) ? other.title_th : other.title;
                                return (
                                    <Link key={other.id} href={`/blog/${other.slug}`} className="group flex gap-4 items-start">
                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                                            {other.image ? (
                                                <Image
                                                    src={other.image}
                                                    alt={otherTitle}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-pink-400 transition-colors line-clamp-2">
                                                {otherTitle}
                                            </h4>
                                            <time className="text-xs text-gray-500 block">
                                                {new Date(other.createdAt).toLocaleDateString(isThai ? "th-TH" : "en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </time>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Newsletter / Promo */}
                    <div className="bg-gradient-to-br from-pink-600/10 to-purple-600/10 rounded-2xl p-6 border border-pink-500/20 text-center">
                        <h3 className="text-lg font-bold text-white mb-2">
                            {isThai ? "สมัครรับข่าวสาร" : "Subscribe to our newsletter"}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            {isThai ? "รับข่าวสารล่าสุดส่งตรงถึงกล่องข้อความของคุณ" : "Get the latest updates directly to your inbox."}
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder={isThai ? "กรอกอีเมล" : "Enter email"}
                                className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-full focus:outline-none focus:border-pink-500/50"
                            />
                            <button className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg px-4 py-2 text-sm font-bold transition-colors">
                                {isThai ? "สมัคร" : "Join"}
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
