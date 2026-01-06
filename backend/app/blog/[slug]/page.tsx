import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BlogPostContent from "./BlogPostContent";

import { Metadata } from "next";

// Force dynamic to ensure we get fresh data
export const dynamic = "force-dynamic";

interface BlogPostProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
        where: { slug },
        select: {
            title: true,
            excerpt: true,
            image: true,
            metaTitle: true,
            metaDescription: true,
            metaKeywords: true
        }
    });

    if (!post) {
        return {
            title: 'Post Not Found | Innovera',
            description: 'The requested blog post could not be found.'
        };
    }

    const title = post.metaTitle || `${post.title} | Innovera`;
    const description = post.metaDescription || post.excerpt || `Read ${post.title} on Innovera Blog`;
    const keywords = post.metaKeywords ? post.metaKeywords.split(',').map(k => k.trim()) : [];

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            images: post.image ? [{ url: post.image }] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: post.image ? [post.image] : [],
        }
    };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            author: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });

    if (!post || !post.published) {
        notFound();
    }

    // Fetch other posts for the sidebar (Trending/Recent)
    const otherPosts = await prisma.post.findMany({
        where: {
            published: true,
            NOT: {
                id: post.id
            }
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
            author: true
        }
    });

    return (
        <main className="min-h-screen bg-[#050505] font-nunito flex flex-col">
            <Navbar />

            <div className="flex-grow pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
                <BlogPostContent post={post as any} otherPosts={otherPosts as any[]} />
            </div>

            <Footer />
        </main>
    );
}
