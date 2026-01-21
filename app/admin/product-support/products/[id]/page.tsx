import { getProduct } from "@/app/actions/product";
import { getCategories } from "@/app/actions/docCategory";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditProductButton from "../../../components/EditProductButton";
import DocumentManager from "./components/DocumentManager";

export default async function ProductDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const { id } = await params;
    const product = await getProduct(id);
    if (!product) redirect('/admin/product-support');

    const categories = await getCategories(id);

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <Link href="/admin/product-support" className="text-blue-400 hover:text-blue-300 mb-4 block flex items-center gap-1 transition-colors">
                <span aria-hidden="true">&larr;</span> Back to Product Support
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Manage Documents for: <span className="text-blue-400">{product.name}</span></h1>
                <EditProductButton product={product} />
            </div>

            <DocumentManager productId={id} categories={categories} />
        </div>
    );
}
