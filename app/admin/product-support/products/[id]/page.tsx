import { getProduct } from "@/app/actions/product";
import { getCategories } from "@/app/actions/docCategory";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditProductButton from "../../../components/EditProductButton";
import DocumentManager from "./components/DocumentManager";
import { ArrowLeft, FileText } from "lucide-react";

export default async function ProductDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
    let session;
    try {
        session = await auth();
    } catch (error) {
        console.error("ProductDocumentsPage Auth Error:", error);
        redirect('/');
    }

    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const { id } = await params;
    const product = await getProduct(id);
    if (!product) redirect('/admin/product-support');

    const categories = await getCategories(id);

    return (
        <div className="container mx-auto">
            <Link href="/admin/product-support" className="text-indigo-600 hover:text-indigo-700 mb-6 inline-flex items-center gap-2 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Product Support
            </Link>

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Documents</h1>
                        <p className="text-indigo-600 font-medium">{product.name}</p>
                    </div>
                </div>
                <EditProductButton product={product} />
            </div>

            <DocumentManager productId={id} categories={categories} />
        </div>
    );
}
