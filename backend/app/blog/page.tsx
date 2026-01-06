
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BlogGrid from "./BlogGrid";

import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Blog | Innovera",
    description: "Read the latest news, insights, and stories from the Innovera team.",
    openGraph: {
        title: "Blog | Innovera",
        description: "Read the latest news, insights, and stories from the Innovera team.",
        type: "website",
    }
};

export default async function BlogPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
            author: {
                select: {
                    name: true,
                    image: true
                }
            }
        }
    });

    return (
        <main className="min-h-screen bg-[#050505] font-nunito flex flex-col">
            <Navbar />

            <div className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Latest Updates
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        News, insights, and stories from our team.
                    </p>
                </header>

                {posts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No posts found. check back later!
                    </div>
                ) : (
                    <BlogGrid posts={posts as any} />
                )}
            </div>

            <Footer />
        </main>
    );
}
