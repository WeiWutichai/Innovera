'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen, BookOpen, Play } from 'lucide-react';

interface Document {
    id: string;
    title: string;
    content: string;
    videoUrl?: string | null;
    order: number;
}

interface Subcategory {
    id: string;
    name: string;
    order: number;
    documents: Document[];
}

interface Category {
    id: string;
    name: string;
    order: number;
    subcategories: Subcategory[];
}

interface Product {
    id: string;
    name: string;
    description?: string | null;
    image?: string | null;
}

interface DocumentViewerProps {
    product: Product;
    categories: Category[];
    legacyDocuments: Document[];
}

export default function DocumentViewer({ product, categories, legacyDocuments }: DocumentViewerProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories.map(c => c.id)));
    const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    const toggleCategory = (id: string) => {
        const newSet = new Set(expandedCategories);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedCategories(newSet);
    };

    const toggleSubcategory = (id: string) => {
        const newSet = new Set(expandedSubcategories);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedSubcategories(newSet);
    };

    const groupedLegacyDocs = legacyDocuments.reduce((acc, doc) => {
        const cat = (doc as any).category || "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(doc);
        return acc;
    }, {} as Record<string, Document[]>);

    const hasTreeMenu = categories.length > 0;
    const hasLegacyDocs = legacyDocuments.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Modern Glass Effect */}
            <aside className="lg:col-span-3">
                <div className="sticky top-24 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl border border-white/10">
                    {/* Product Header with Gradient */}
                    <div className="relative p-6 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border-b border-white/10">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptLTYgNmgtNnY2aDZ2LTZ6bTYgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
                        <div className="relative">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-28 object-cover rounded-xl mb-4 ring-2 ring-white/20" />
                            ) : (
                                <div className="w-full h-28 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-white/80" />
                                </div>
                            )}
                            <h2 className="font-bold text-xl text-white mb-1">{product.name}</h2>
                            <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
                        </div>
                    </div>

                    {/* Tree Navigation */}
                    <nav className="p-4 max-h-[55vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">คู่มือการใช้งาน</h3>
                        </div>

                        {/* New Tree Structure */}
                        {hasTreeMenu && categories.map((category) => (
                            <div key={category.id} className="mb-2">
                                {/* Category */}
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl text-left transition-all duration-200 group"
                                >
                                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20">
                                        {expandedCategories.has(category.id) ? <FolderOpen className="w-3.5 h-3.5 text-white" /> : <Folder className="w-3.5 h-3.5 text-white" />}
                                    </span>
                                    <span className="flex-1 text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{category.name}</span>
                                    {expandedCategories.has(category.id) ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                                </button>

                                {/* Subcategories */}
                                {expandedCategories.has(category.id) && (
                                    <div className="ml-5 pl-4 border-l-2 border-white/10 mt-1 space-y-1">
                                        {category.subcategories.map((subcategory) => (
                                            <div key={subcategory.id}>
                                                {/* Subcategory */}
                                                <button
                                                    onClick={() => toggleSubcategory(subcategory.id)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-left transition-all duration-200 group"
                                                >
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-br from-blue-400 to-cyan-500 shadow-sm">
                                                        {expandedSubcategories.has(subcategory.id) ? <FolderOpen className="w-3 h-3 text-white" /> : <Folder className="w-3 h-3 text-white" />}
                                                    </span>
                                                    <span className="flex-1 text-xs text-gray-400 group-hover:text-gray-200 transition-colors">{subcategory.name}</span>
                                                    {expandedSubcategories.has(subcategory.id) ? <ChevronDown className="w-3 h-3 text-gray-600" /> : <ChevronRight className="w-3 h-3 text-gray-600" />}
                                                </button>

                                                {/* Documents */}
                                                {expandedSubcategories.has(subcategory.id) && (
                                                    <div className="ml-4 pl-3 border-l border-white/5 mt-1 space-y-0.5">
                                                        {subcategory.documents.map((doc) => (
                                                            <button
                                                                key={doc.id}
                                                                onClick={() => setSelectedDoc(doc)}
                                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-200 ${selectedDoc?.id === doc.id
                                                                        ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                                                                        : 'hover:bg-white/5'
                                                                    }`}
                                                            >
                                                                <FileText className={`w-3.5 h-3.5 ${selectedDoc?.id === doc.id ? 'text-indigo-400' : 'text-gray-500'}`} />
                                                                <span className={`text-xs truncate ${selectedDoc?.id === doc.id ? 'text-white font-medium' : 'text-gray-400'}`}>{doc.title}</span>
                                                                {doc.videoUrl && <Play className="w-3 h-3 text-red-400 ml-auto flex-shrink-0" />}
                                                            </button>
                                                        ))}
                                                        {subcategory.documents.length === 0 && (
                                                            <div className="px-3 py-2 text-xs text-gray-600 italic">ไม่มีเอกสาร</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {category.subcategories.length === 0 && (
                                            <div className="px-3 py-2 text-xs text-gray-600 italic">ไม่มีหมวดหมู่ย่อย</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Legacy Documents */}
                        {!hasTreeMenu && hasLegacyDocs && Object.entries(groupedLegacyDocs).map(([category, docs]) => (
                            <div key={category} className="mb-3">
                                <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">{category}</div>
                                {docs.map((doc) => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setSelectedDoc(doc)}
                                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${selectedDoc?.id === doc.id
                                                ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30'
                                                : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <FileText className={`w-4 h-4 ${selectedDoc?.id === doc.id ? 'text-indigo-400' : 'text-gray-500'}`} />
                                        <span className={`text-sm truncate ${selectedDoc?.id === doc.id ? 'text-white font-medium' : 'text-gray-400'}`}>{doc.title}</span>
                                    </button>
                                ))}
                            </div>
                        ))}

                        {!hasTreeMenu && !hasLegacyDocs && (
                            <div className="text-center py-12 text-gray-500 text-sm">
                                <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                                ยังไม่มีคู่มือ
                            </div>
                        )}
                    </nav>
                </div>
            </aside>

            {/* Right Content - Modern Card Design */}
            <main className="lg:col-span-9">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 min-h-[70vh] overflow-hidden">
                    {selectedDoc ? (
                        <article className="h-full">
                            {/* Document Header */}
                            <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span>Documentation</span>
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-900">{selectedDoc.title}</h1>
                                    </div>
                                    {selectedDoc.videoUrl && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                                            <Play className="w-3.5 h-3.5" />
                                            มีวิดีโอ
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Document Content */}
                            <div className="p-8">
                                {selectedDoc.videoUrl && (
                                    <div className="mb-8 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5">
                                        <iframe
                                            src={selectedDoc.videoUrl.replace("watch?v=", "embed/")}
                                            className="w-full aspect-video"
                                            allowFullScreen
                                            title="Video"
                                        />
                                    </div>
                                )}

                                <div
                                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-img:rounded-xl prose-img:shadow-lg"
                                    dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
                                />
                            </div>
                        </article>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center transform rotate-3">
                                    <BookOpen className="w-12 h-12 text-indigo-500" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
                                    <FileText className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Documentation Library</h2>
                            <p className="text-gray-500 max-w-md mb-6">
                                เลือกหัวข้อจากเมนูด้านซ้ายเพื่อดูคู่มือการใช้งาน และเริ่มต้นใช้งานผลิตภัณฑ์ของคุณ
                            </p>
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full text-sm text-indigo-600 font-medium">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                                เลือกเอกสารเพื่อเริ่มต้น
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
