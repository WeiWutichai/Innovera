import { getPost, createComment } from "@/app/actions/community";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

import DeletePostButton from "./DeletePostButton";
import ReplySection from "./ReplySection";

export default async function PostPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const post = await getPost(params.id);
    if (!post) notFound();

    const session = await auth();
    const isAdmin = session?.user?.role === 'ADMIN';

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/community/forum" className="text-gray-500 hover:text-blue-600 mb-6 block flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to topics
            </Link>

            {/* Post Content */}
            <div className="bg-white border rounded-lg shadow-sm mb-8 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {post.user.image ? <img src={post.user.image} alt="" className="w-full h-full object-cover" /> : <span className="text-indigo-600 font-bold text-lg">{post.user.name?.[0]}</span>}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-gray-900">{post.title}</h1>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{post.user.name || 'Anonymous'}</span>
                                    <span>•</span>
                                    <span>{post.createdAt.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        {isAdmin && <DeletePostButton postId={post.id} />}
                    </div>

                    <div className="prose max-w-none text-gray-800 mb-8 leading-relaxed">
                        {post.content}
                    </div>

                    {/* Post Actions & Feedback */}
                    <div className="border-t pt-6">
                        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
                            <p className="font-medium text-gray-900">Did this topic help you find an answer to your question?</p>
                            <div className="flex items-center space-x-4">
                                <button className="w-10 h-10 rounded-full bg-yellow-100 hover:bg-yellow-200 flex items-center justify-center text-2xl transition">😊</button>
                                <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl transition">😐</button>
                                <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl transition">😞</button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <img src={post.user.image || `https://ui-avatars.com/api/?name=${post.user.name}`} className="w-5 h-5 rounded-full" />
                                <span>1 person likes this</span>
                            </div>
                            <div className="flex items-center space-x-6">
                                <button className="flex items-center gap-1 hover:text-blue-600"><span className="text-lg">👍</span> Like</button>
                                <button className="flex items-center gap-1 hover:text-blue-600"><span className="text-lg">❞</span> Quote</button>
                                <button className="flex items-center gap-1 hover:text-blue-600"><span className="text-lg">☆</span> Subscribe</button>
                                <button className="flex items-center gap-1 hover:text-blue-600"><span className="text-lg">➦</span> Share</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Replies Section */}
            <div className="border rounded-lg bg-white overflow-hidden mb-8">
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-bold text-gray-800">{post.comments.length} replies</h3>
                </div>

                <div className="p-8 min-h-[200px] flex flex-col items-center justify-center">
                    {post.comments.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-2">Be the first to reply!</p>
                        </div>
                    ) : (
                        <div className="w-full space-y-8">
                            {post.comments.map((comment) => (
                                <div key={comment.id} className="flex space-x-4 border-b pb-8 last:border-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                        {comment.user.image ? <img src={comment.user.image} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full w-full font-bold text-gray-500">{comment.user.name?.[0]}</span>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-900">{comment.user.name || 'Anonymous'}</span>
                                            <span className="text-xs text-gray-500">{comment.createdAt.toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reply Input Area */}
            <ReplySection postId={params.id} isLoggedIn={!!session} />
        </div>
    );
}
