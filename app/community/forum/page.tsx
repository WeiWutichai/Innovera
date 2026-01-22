import { getPosts, createPost } from "@/app/actions/community";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ForumPage() {
    const posts = await getPosts();
    const session = await auth();

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Hero Section */}
            <div className="relative bg-[#0B1120] text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-purple-500/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <nav className="flex items-center justify-center space-x-2 text-sm text-slate-400 mb-8 font-medium">
                            <Link href="/community" className="hover:text-white transition-colors duration-200">Community</Link>
                            <span className="text-slate-600">/</span>
                            <span className="text-purple-400">Forum</span>
                        </nav>

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Forums</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Discuss products, share ideas, and help others in our developer community.
                        </p>

                        <Link
                            href="/community/forum/create"
                            className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Start a Discussion
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-20 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden max-w-5xl mx-auto">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">💬</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">No discussions yet</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">Be the first to start a conversation in the community.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {posts.map((post) => (
                                <div key={post.id} className="p-6 md:p-8 hover:bg-slate-50/80 transition-colors duration-200 flex items-start gap-6 group">
                                    <div className="flex-shrink-0 pt-1">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                                            {post.user.image ? (
                                                <img src={post.user.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-xl text-indigo-400">{post.user.name?.[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/community/forum/${post.id}`} className="block focus:outline-none mb-2">
                                            <h2 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate leading-tight">
                                                {post.title}
                                            </h2>
                                        </Link>
                                        <p className="text-slate-600 line-clamp-2 text-base mb-4 leading-relaxed">{post.content}</p>

                                        <div className="flex items-center text-sm text-slate-500 gap-4 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-700">{post.user.name || 'Anonymous'}</span>
                                            </div>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-slate-400">{post.createdAt.toLocaleDateString()}</span>

                                            <div className="ml-auto flex items-center gap-6">
                                                <span className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                                    <span className="font-medium">{post._count.comments}</span>
                                                    <span className="hidden sm:inline">replies</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
