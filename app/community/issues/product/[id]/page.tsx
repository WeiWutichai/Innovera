import { getIssues } from "@/app/actions/issue";
import { getProduct } from "@/app/actions/product";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ProductIssueListClient from "./ProductIssueListClient";

export default async function ProductIssuesPage(props: { params: Promise<{ id: string }> }) {
    const session = await auth();
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
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="container mx-auto px-4 py-8">
                <Link href="/community/issues" className="text-blue-600 hover:underline mb-4 block">&larr; Back to All Issues</Link>

                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-[#4B286D] mb-2">{product.name}</h1>
                        <p className="text-gray-600">Issue Tracker</p>
                    </div>
                </div>

                <ProductIssueListClient product={product} issues={issues} user={session.user} />
            </div>
        </div>
    );
}
