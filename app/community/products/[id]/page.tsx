import { getProduct } from "@/app/actions/product";
import { getDocuments } from "@/app/actions/document";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const product = await getProduct(params.id);
    if (!product) notFound();

    const documents = await getDocuments(params.id);

    // Group documents by category if needed, or just list them
    const groupedDocs = documents.reduce((acc: any, doc: any) => {
        const cat = doc.category || "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(doc);
        return acc;
    }, {} as Record<string, any[]>);

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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-lg shadow-sm border p-6">
                            <div className="mb-6">
                                {product.image && <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-4" />}
                                <h2 className="font-bold text-xl text-gray-900 mb-2">{product.name}</h2>
                                <p className="text-sm text-gray-600">{product.description}</p>
                            </div>

                            <nav className="space-y-1">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</h3>
                                {Object.keys(groupedDocs).map(category => (
                                    <a href={`#cat-${category.replace(/\s+/g, '-')}`} key={category} className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition">
                                        {category}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Areas */}
                    <main className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
                            <h1 className="text-3xl font-bold mb-4">Documentation Library</h1>
                            <p className="text-lg text-gray-600 mb-6">Browse guides, tutorials, and references for {product.name}.</p>

                            {/* Categories Loop */}
                            {Object.entries(groupedDocs).map(([category, docs]) => (
                                <div key={category} id={`cat-${category.replace(/\s+/g, '-')}`} className="mb-10 scroll-mt-28">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="w-2 h-8 bg-blue-600 rounded-r mr-3"></span>
                                        {category}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(docs as any[]).map((doc: any) => (
                                            <Link href={`/community/docs/${doc.id}`} key={doc.id} className="group block p-5 border rounded-lg hover:border-blue-400 hover:shadow-md transition bg-white">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition">{doc.title}</h3>
                                                    {doc.videoUrl && <span className="flex-shrink-0 text-red-500"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg></span>}
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2">Click to view article</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {documents.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-lg dashed-border">
                                    <p className="text-gray-500 italic">No documentation available yet.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
