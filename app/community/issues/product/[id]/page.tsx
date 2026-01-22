import { getIssues } from "@/app/actions/issue";
import { getProduct } from "@/app/actions/product";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ProductIssueListClient from "./ProductIssueListClient";

export default async function ProductIssuesPage(props: { params: Promise<{ id: string }> }) {
    let session;
    try {
        session = await auth();
    } catch (error) {
        console.error("ProductIssuesPage Auth Error:", error);
        redirect('/login?callbackUrl=/community/issues');
    }

    // Authorization check
    if (!session || !session.user) {
        redirect('/login?callbackUrl=/community/issues');
    }

    const params = await props.params;
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    const issues = await getIssues(params.id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 font-sans">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-20 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto px-4 py-8">
                {/* Back Link */}
                <Link
                    href="/community/issues"
                    className="group inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 font-medium transition-colors duration-300"
                >
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:bg-indigo-50 flex items-center justify-center transition-all duration-300">
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    Back to All Issues
                </Link>

                {/* Header Section */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                            {product.name}
                        </h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Issue Tracker
                        </p>
                    </div>
                </div>

                <ProductIssueListClient product={product} issues={issues} user={session.user} />
            </div>
        </div>
    );
}
