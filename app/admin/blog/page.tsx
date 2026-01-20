
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BlogList from "./BlogList";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            author: {
                select: { name: true },
            },
        },
    });

    return (
        <div className="font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
                        <p className="text-gray-400">
                            Create and manage blog posts.
                        </p>
                    </div>
                    <Link
                        href="/admin/blog/create"
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Post
                    </Link>
                </div>

                <BlogList posts={posts} />
            </div>
        </div>
    );
}
