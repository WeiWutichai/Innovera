
"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deletePost } from "./actions"; // We'll create this next

interface Post {
    id: number;
    title: string;
    slug: string;
    published: boolean;
    createdAt: Date;
    author: { name: string | null };
}

export default function BlogList({ posts }: { posts: Post[] }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this post?")) {
            startTransition(async () => {
                await deletePost(id);
            });
        }
    };

    return (
        <div className="bg-[#1E293B] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                                <td className="px-6 py-4">{post.author.name || "Unknown"}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                                        }`}>
                                        {post.published ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4" suppressHydrationWarning>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="text-indigo-400 hover:text-indigo-300"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            disabled={isPending}
                                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                        <Link
                                            href={`/admin/blog/${post.id}/edit`}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {posts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No posts found.
                    <br />
                    <Link href="/admin/blog/create" className="text-indigo-400 hover:underline mt-2 inline-block">
                        Create your first post
                    </Link>
                </div>
            )}
        </div>
    );
}
