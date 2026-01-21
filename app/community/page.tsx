import { getProducts } from "@/app/actions/product";
import Link from "next/link";
import { auth } from "@/auth";

export default async function CommunityPage() {
    const allProducts = await getProducts();
    const allowedProducts = ["INNO ONE", "LAW FIRM", "PHYSICAL THERAPY", "DOMITORY"];
    const products = allProducts.filter((product: any) =>
        allowedProducts.some(allowed => product.name.toUpperCase().includes(allowed))
    );
    const session = await auth();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-400 mb-6 flex items-center space-x-2">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <span className="text-white">Community</span>
                    </nav>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Innovera Community</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mb-8">
                        Find answers, share knowledge, and connect with other developers and experts.
                    </p>

                    {/* Search Bar - Placeholder for visual style */}
                    <div className="max-w-2xl relative">
                        <input
                            type="text"
                            placeholder="Search for documentation, topics, or products..."
                            className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                        />
                        <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 -mt-20 relative z-10">
                    <Link href="/community/forum" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-blue-500">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Community Forums</h2>
                        </div>
                        <p className="text-gray-600">Join the discussion, ask questions, and share your expertise with fellow Innovera users.</p>
                    </Link>

                    {session?.user?.canReportIssues ? (
                        <Link href="/community/issues" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-red-500">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Manual of Documents and Problem Reporting</h2>
                            </div>
                            <p className="text-gray-600">Submit bug reports or feature requests directly to our product team for review.</p>
                        </Link>
                    ) : (
                        <Link href="/community/issues" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border-t-4 border-gray-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-gray-100 text-gray-500 rounded-lg">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Product Support</h2>
                            </div>
                            <p className="text-gray-600">Need help? Contact support or check your eligibility for issue reporting.</p>
                        </Link>
                    )}
                </div>

                <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Explore Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product: any) => (
                        <Link href={`/community/products/${product.id}`} key={product.id} className="block group h-full">
                            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition">{product.name}</h3>
                                    <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                                    <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                        View Documentation &rarr;
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-1">Check back later for new product guides and documentation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
