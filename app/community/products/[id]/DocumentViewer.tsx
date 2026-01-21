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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Clean Light Theme */}
            <aside className="lg:col-span-3">
                <div className="sticky top-24 rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200/80">
                    {/* Product Header */}
                    <div className="p-5 bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-xl ring-2 ring-white shadow-md" />
                            ) : (
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                                    <BookOpen className="w-7 h-7 text-white" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h2 className="font-bold text-lg text-gray-900 truncate">{product.name}</h2>
                                <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tree Navigation */}
                    <nav className="p-4 max-h-[55vh] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <div className="w-1.5 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">คู่มือการใช้งาน</h3>
                        </div>

                        {/* New Tree Structure */}
                        {hasTreeMenu && categories.map((category) => (
                            <div key={category.id} className="mb-1">
                                {/* Category */}
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl text-left transition-all duration-200 group"
                                >
                                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                                        {expandedCategories.has(category.id) ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                                    </span>
                                    <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{category.name}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedCategories.has(category.id) ? '' : '-rotate-90'}`} />
                                </button>

                                {/* Subcategories */}
                                {expandedCategories.has(category.id) && (
                                    <div className="ml-5 pl-4 border-l-2 border-gray-100 mt-1 space-y-0.5">
                                        {category.subcategories.map((subcategory) => (
                                            <div key={subcategory.id}>
                                                {/* Subcategory */}
                                                <button
                                                    onClick={() => toggleSubcategory(subcategory.id)}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 rounded-lg text-left transition-all duration-200 group"
                                                >
                                                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-purple-50 text-purple-500 group-hover:bg-purple-100 transition-colors">
                                                        {expandedSubcategories.has(subcategory.id) ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
                                                    </span>
                                                    <span className="flex-1 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">{subcategory.name}</span>
                                                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${expandedSubcategories.has(subcategory.id) ? '' : '-rotate-90'}`} />
                                                </button>

                                                {/* Documents */}
                                                {expandedSubcategories.has(subcategory.id) && (
                                                    <div className="ml-4 pl-3 border-l border-gray-100 mt-1 space-y-0.5">
                                                        {subcategory.documents.map((doc) => (
                                                            <button
                                                                key={doc.id}
                                                                onClick={() => setSelectedDoc(doc)}
                                                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-200 ${selectedDoc?.id === doc.id
                                                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                                        : 'hover:bg-gray-50 text-gray-600'
                                                                    }`}
                                                            >
                                                                <FileText className={`w-4 h-4 flex-shrink-0 ${selectedDoc?.id === doc.id ? 'text-indigo-500' : 'text-gray-400'}`} />
                                                                <span className={`text-sm truncate ${selectedDoc?.id === doc.id ? 'font-medium' : ''}`}>{doc.title}</span>
                                                                {doc.videoUrl && <Play className="w-3.5 h-3.5 text-red-400 ml-auto flex-shrink-0" />}
                                                            </button>
                                                        ))}
                                                        {subcategory.documents.length === 0 && (
                                                            <div className="px-3 py-2 text-xs text-gray-400 italic">ไม่มีเอกสาร</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {category.subcategories.length === 0 && (
                                            <div className="px-3 py-2 text-xs text-gray-400 italic">ไม่มีหมวดหมู่ย่อย</div>
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
                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${selectedDoc?.id === doc.id
                                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                : 'hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <FileText className={`w-4 h-4 ${selectedDoc?.id === doc.id ? 'text-indigo-500' : 'text-gray-400'}`} />
                                        <span className={`text-sm truncate ${selectedDoc?.id === doc.id ? 'font-medium' : ''}`}>{doc.title}</span>
                                    </button>
                                ))}
                            </div>
                        ))}

                        {!hasTreeMenu && !hasLegacyDocs && (
                            <div className="text-center py-12 text-gray-400 text-sm">
                                <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                                ยังไม่มีคู่มือ
                            </div>
                        )}
                    </nav>
                </div>
            </aside>

            {/* Right Content - Clean Card Design */}
            <main className="lg:col-span-9">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 min-h-[70vh] overflow-hidden">
                    {selectedDoc ? (
                        <article className="h-full">
                            {/* Document Header */}
                            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium mb-2">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span>Documentation</span>
                                        </div>
                                        <h1 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h1>
                                    </div>
                                    {selectedDoc.videoUrl && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100">
                                            <Play className="w-3.5 h-3.5" />
                                            มีวิดีโอ
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Document Content */}
                            <div className="p-8">
                                {selectedDoc.videoUrl && (
                                    <div className="mb-8 rounded-xl overflow-hidden shadow-md ring-1 ring-gray-200">
                                        <iframe
                                            src={selectedDoc.videoUrl.replace("watch?v=", "embed/")}
                                            className="w-full aspect-video"
                                            allowFullScreen
                                            title="Video"
                                        />
                                    </div>
                                )}

                                <div
                                    className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-indigo-600 prose-strong:text-gray-900 prose-img:rounded-xl prose-img:shadow-md"
                                    dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
                                />
                            </div>
                        </article>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                                    <BookOpen className="w-10 h-10 text-indigo-500" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Documentation Library</h2>
                            <p className="text-gray-500 max-w-md mb-6">
                                เลือกหัวข้อจากเมนูด้านซ้ายเพื่อดูคู่มือการใช้งาน
                            </p>
                            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-sm text-indigo-600 font-medium border border-indigo-100">
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
