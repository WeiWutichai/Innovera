import { getProduct } from "@/app/actions/product";
import { getDocuments } from "@/app/actions/document";
import { getCategories } from "@/app/actions/docCategory";
import Link from "next/link";
import { notFound } from "next/navigation";
import DocumentViewer from "./DocumentViewer";

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const product = await getProduct(params.id);
    if (!product) notFound();

    const [categories, documents] = await Promise.all([
        getCategories(params.id),
        getDocuments(params.id)
    ]);

    // Filter legacy documents (those without subcategoryId)
    const legacyDocuments = documents.filter((doc: any) => !doc.subcategoryId);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Product Header */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/community" className="text-gray-500 hover:text-blue-600 transition">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>
                        <nav className="text-sm font-medium breadcrumbs">
                            <ul className="flex items-center space-x-2 text-gray-500">
                                <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
                                <li>/</li>
                                <li><Link href="/community" className="hover:text-blue-600">Community</Link></li>
                                <li>/</li>
                                <li className="text-gray-900 font-bold">{product.name}</li>
                            </ul>
                        </nav>
                    </div>

                    {/* In-Product Search */}
                    <div className="relative w-64 hidden md:block">
                        <input type="text" placeholder="Search this product..." className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <DocumentViewer
                    product={product}
                    categories={categories}
                    legacyDocuments={legacyDocuments}
                />
            </div>
        </div>
    );
}
