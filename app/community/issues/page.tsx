import { getMyProducts } from "@/app/actions/product";
import { getUnreadCountsByProduct } from "@/app/actions/notification";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import MyProductsList from "./MyProductsList";

export default async function IssuesPage() {
    const session = await auth();

    // Authorization check
    if (!session || !session.user) {
        redirect('/login?callbackUrl=/community/issues');
    }

    const myProducts = await getMyProducts();
    const notificationCounts = await getUnreadCountsByProduct();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F7F8FC] to-[#F3F4F8] font-sans selection:bg-indigo-100 selection:text-indigo-900">

            <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
                <Link
                    href="/community"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-4 group font-medium"
                >
                    <span className="p-1 rounded-full bg-white shadow-sm border border-gray-100 group-hover:border-indigo-100 group-hover:shadow-md transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </span>
                    Back to Community
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                            Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Documentation</span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                            Access manuals, guides, and report problems for all your assigned products in one centralized dashboard.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-8">
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/50 shadow-sm inline-flex items-center gap-3 text-gray-800">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                                    My Products
                                    <span className="ml-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold border border-indigo-100">
                                        {myProducts.length}
                                    </span>
                                </h2>
                            </div>
                            <MyProductsList products={myProducts} notificationCounts={notificationCounts} />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
