
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import BlogList from "./BlogList";
import { Plus, FileText } from "lucide-react";

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
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Blog Management</h1>
                        <p className="text-gray-500">
                            Create and manage blog posts.
                        </p>
                    </div>
                    <Link
                        href="/admin/blog/create"
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                    >
                        <Plus className="w-5 h-5" />
                        New Post
                    </Link>
                </div>

                <BlogList posts={posts} />
            </div>
        </div>
    );
}
