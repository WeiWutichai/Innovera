import { getPosts, createPost } from "@/app/actions/community";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ForumPage() {
    const posts = await getPosts();
    const session = await auth();

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/community" className="text-gray-500 hover:text-blue-600 mb-6 block flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Community
            </Link>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
                    <p className="text-gray-500">Discuss products, share ideas, and help others.</p>
                </div>
                <Link
                    href="/community/forum/create"
                    className="bg-[#5B2C6F] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#4a235a] transition-colors shadow-md flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Start a Discussion
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {posts.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">💬</div>
                        <h3 className="text-xl font-bold mb-2">No discussions yet</h3>
                        <p className="text-gray-500 mb-6">Be the first to start a conversation in the community.</p>
                        <Link
                            href="/community/forum/create"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                        >
                            Start a Discussion
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y">
                        {posts.map((post) => (
                            <div key={post.id} className="p-6 hover:bg-gray-50 transition flex items-start gap-4 group">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                        {post.user.image ? <img src={post.user.image} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full font-bold text-gray-500">{post.user.name?.[0]}</span>}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/community/forum/${post.id}`} className="block focus:outline-none">
                                        <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">{post.title}</h2>
                                        <p className="text-gray-600 line-clamp-2 text-sm mb-3">{post.content}</p>
                                    </Link>
                                    <div className="flex items-center text-xs text-gray-500 gap-4">
                                        <span className="font-medium text-gray-700">{post.user.name || 'Anonymous'}</span>
                                        <span>•</span>
                                        <span>{post.createdAt.toLocaleDateString()}</span>
                                        <span className="ml-auto flex items-center gap-1 text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            {post._count.comments} replies
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
