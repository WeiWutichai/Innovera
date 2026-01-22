import { getProducts } from "@/app/actions/product";
import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
    const allProducts = await getProducts();
    const allowedProducts = ["INNO ONE", "LAW FIRM", "PHYSICAL THERAPY", "DOMITORY"];
    const products = allProducts.filter((product: any) =>
        allowedProducts.some(allowed => product.name.toUpperCase().includes(allowed))
    );
    const session = await auth();

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Hero Section */}
            <div className="relative bg-[#0B1120] text-white py-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8 font-medium">
                        <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
                        <span className="text-slate-600">/</span>
                        <span className="text-indigo-400">Community</span>
                    </nav>

                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                            Innovera <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">Community</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                            Find answers, share knowledge, and connect with other developers and experts in our growing community.
                        </p>

                        <div className="max-w-xl relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for documentation, topics, or products..."
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-slate-900 transition-all shadow-xl"
                                />
                                <svg className="w-6 h-6 text-slate-500 absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 -mt-24 relative z-20">
                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <Link href="/community/forum" className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-900/5 border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Community Forums</h2>
                            <p className="text-slate-600 leading-relaxed mb-6">Join the discussion, ask questions, and share your expertise with fellow Innovera users in our organized discussion boards.</p>
                            <span className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                                Enter Forums <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </span>
                        </div>
                    </Link>

                    {session?.user?.canReportIssues ? (
                        <Link href="/community/issues" className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-900/5 border border-slate-100 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">Documentation & Reporting</h2>
                                <p className="text-slate-600 leading-relaxed mb-6">Submit bug reports, feature requests, or browse comprehensive documentation directly to our product team.</p>
                                <span className="inline-flex items-center text-red-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    View Manuals <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <Link href="/community/issues" className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-900/5 border border-slate-100 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">Product Support</h2>
                                <p className="text-slate-600 leading-relaxed mb-6">Need assistance? Contact our support team or check your eligibility for detailed issue reporting.</p>
                                <span className="inline-flex items-center text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                                    Get Support <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </Link>
                    )}
                </div>

                {/* Explore Products */}
                <div className="flex items-center justify-center mb-12">
                    <h2 className="text-3xl font-extrabold text-slate-900 relative">
                        Explore Products
                        <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-indigo-500 rounded-full"></span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product: any) => (
                        <Link href={`/community/products/${product.id}`} key={product.id} className="block group h-full">
                            <div className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 h-full flex flex-col border border-slate-100 hover:border-indigo-100 hover:-translate-y-2">
                                <div className="relative h-56 overflow-hidden bg-slate-100">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 group-hover:bg-indigo-50/30 group-hover:text-indigo-300 transition-colors">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                                    <p className="text-slate-500 mb-6 flex-grow line-clamp-2 leading-relaxed">{product.description || "No description available for this product."}</p>
                                    <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-1 transition-transform mt-auto">
                                        View Documentation
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6 text-slate-300">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Check back later for new product guides and documentation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
