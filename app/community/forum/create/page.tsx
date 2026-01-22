import { auth } from "@/auth";
import Link from "next/link";
import CreatePostForm from "./CreatePostForm";

export default async function CreatePostPage() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Hero Section */}
            <div className="relative bg-[#0B1120] text-white py-16 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <nav className="flex items-center space-x-2 text-sm text-slate-400 font-medium mb-6">
                        <Link href="/community" className="hover:text-white transition-colors duration-200">Community</Link>
                        <span className="text-slate-600">/</span>
                        <Link href="/community/forum" className="hover:text-white transition-colors duration-200">Forum</Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-purple-400">New Topic</span>
                    </nav>

                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                        Create a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">New Topic</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Start a discussion with the community.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 -mt-10 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden max-w-4xl">
                    <div className="p-8 md:p-10">
                        <CreatePostForm isLoggedIn={!!session} />
                    </div>
                </div>
            </div>
        </div>
    );
}
