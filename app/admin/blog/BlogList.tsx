
"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deletePost } from "./actions";
import { ExternalLink, Pencil, Trash2, FileText } from "lucide-react";

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
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs tracking-wider border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Author</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                                <td className="px-6 py-4 text-gray-600">{post.author.name || "Unknown"}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${post.published
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                        : "bg-amber-50 text-amber-600 border border-amber-100"
                                        }`}>
                                        {post.published ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500" suppressHydrationWarning>
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        <Link
                                            href={`/admin/blog/${post.id}/edit`}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            disabled={isPending}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {posts.length === 0 && (
                <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No posts found.</p>
                    <Link href="/admin/blog/create" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Create your first post →
                    </Link>
                </div>
            )}
        </div>
    );
}
