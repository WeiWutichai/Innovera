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
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Hero Section - Condensed */}
            <div className="relative bg-[#0B1120] text-white py-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <nav className="flex items-center space-x-2 text-sm text-slate-400 font-medium mb-4">
                            <Link href="/community" className="hover:text-white transition-colors duration-200">Community</Link>
                            <span className="text-slate-600">/</span>
                            <Link href="/community/forum" className="hover:text-white transition-colors duration-200">Forum</Link>
                            <span className="text-slate-600">/</span>
                            <span className="text-purple-400 truncate max-w-[200px]">{post.title}</span>
                        </nav>

                        <Link href="/community/forum" className="inline-flex items-center text-slate-300 hover:text-white transition-colors group mb-2">
                            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to topics
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-8 relative z-20">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Post Content */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-8 md:p-10">
                            <div className="flex items-start justify-between mb-8 pb-8 border-b border-slate-100">
                                <div className="flex items-center space-x-5">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                                        {post.user.image ? <img src={post.user.image} alt="" className="w-full h-full object-cover" /> : <span className="text-indigo-500 font-bold text-2xl">{post.user.name?.[0]}</span>}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 leading-tight">{post.title}</h1>
                                        <div className="text-sm text-slate-500 flex items-center gap-3">
                                            <span className="font-semibold text-slate-700">{post.user.name || 'Anonymous'}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span>{post.createdAt.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                {isAdmin && <DeletePostButton postId={post.id} />}
                            </div>

                            <div className="prose prose-lg prose-slate max-w-none text-slate-700 mb-10 leading-relaxed">
                                {post.content}
                            </div>

                            {/* Post Actions & Feedback */}
                            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                                <div className="flex flex-col items-center justify-center text-center space-y-5 mb-8">
                                    <p className="font-medium text-slate-900">Did this topic help you find an answer to your question?</p>
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-200 hover:border-green-200 hover:bg-green-50 text-2xl shadow-sm hover:shadow transition-all group active:scale-95">
                                            <span className="group-hover:scale-110 transition-transform">😊</span>
                                        </button>
                                        <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-200 hover:border-yellow-200 hover:bg-yellow-50 text-2xl shadow-sm hover:shadow transition-all group active:scale-95">
                                            <span className="group-hover:scale-110 transition-transform">😐</span>
                                        </button>
                                        <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 text-2xl shadow-sm hover:shadow transition-all group active:scale-95">
                                            <span className="group-hover:scale-110 transition-transform">😞</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 gap-4 pt-6 border-t border-slate-200/60">
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                        <img src={post.user.image || `https://ui-avatars.com/api/?name=${post.user.name}`} className="w-5 h-5 rounded-full" />
                                        <span className="text-slate-600 font-medium">1 person likes this</span>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-medium"><span className="text-lg">👍</span> Like</button>
                                        <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-medium"><span className="text-lg">❞</span> Quote</button>
                                        <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-medium"><span className="text-lg">☆</span> Subscribe</button>
                                        <button className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-medium"><span className="text-lg">➦</span> Share</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Replies Section */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 text-sm">{post.comments.length}</span>
                                Replies
                            </h3>
                        </div>

                        <div className="p-0">
                            {post.comments.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl opacity-50">💭</div>
                                    <p className="text-slate-500 font-medium">No replies yet. Be the first to reply!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {post.comments.map((comment) => (
                                        <div key={comment.id} className="p-8 flex gap-6 hover:bg-slate-50/30 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 shadow-sm">
                                                {comment.user.image ? <img src={comment.user.image} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full w-full font-bold text-slate-500">{comment.user.name?.[0]}</span>}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="font-bold text-slate-900">{comment.user.name || 'Anonymous'}</span>
                                                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{comment.createdAt.toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reply Input Area */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                        <h3 className="font-bold text-slate-900 text-lg mb-6">Leave a Reply</h3>
                        <ReplySection postId={params.id} isLoggedIn={!!session} />
                    </div>
                </div>
            </div>
        </div>
    );
}
