'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen } from 'lucide-react';

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
    legacyDocuments: Document[]; // For backward compatibility with old flat documents
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

    // Group legacy documents by category
    const groupedLegacyDocs = legacyDocuments.reduce((acc, doc) => {
        const cat = (doc as any).category || "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(doc);
        return acc;
    }, {} as Record<string, Document[]>);

    const hasTreeMenu = categories.length > 0;
    const hasLegacyDocs = legacyDocuments.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Tree Menu */}
            <aside className="lg:col-span-1">
                <div className="sticky top-24 bg-white rounded-lg shadow-sm border overflow-hidden">
                    {/* Product Info */}
                    <div className="p-4 border-b bg-gray-50">
                        {product.image && <img src={product.image} alt={product.name} className="w-full h-24 object-cover rounded mb-3" />}
                        <h2 className="font-bold text-lg text-gray-900">{product.name}</h2>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>

                    {/* Tree Navigation */}
                    <nav className="p-3 max-h-[60vh] overflow-y-auto">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">คู่มือการใช้งาน</h3>

                        {/* New Tree Structure */}
                        {hasTreeMenu && categories.map((category) => (
                            <div key={category.id} className="mb-1">
                                {/* Category */}
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded text-left transition-colors"
                                >
                                    {expandedCategories.has(category.id) ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                                    {expandedCategories.has(category.id) ? <FolderOpen className="w-4 h-4 text-yellow-500" /> : <Folder className="w-4 h-4 text-yellow-500" />}
                                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                                </button>

                                {/* Subcategories */}
                                {expandedCategories.has(category.id) && (
                                    <div className="ml-4 pl-2 border-l border-gray-200">
                                        {category.subcategories.map((subcategory) => (
                                            <div key={subcategory.id}>
                                                {/* Subcategory */}
                                                <button
                                                    onClick={() => toggleSubcategory(subcategory.id)}
                                                    className="w-full flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded text-left transition-colors"
                                                >
                                                    {expandedSubcategories.has(subcategory.id) ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
                                                    {expandedSubcategories.has(subcategory.id) ? <FolderOpen className="w-3 h-3 text-blue-500" /> : <Folder className="w-3 h-3 text-blue-500" />}
                                                    <span className="text-xs text-gray-600">{subcategory.name}</span>
                                                </button>

                                                {/* Documents */}
                                                {expandedSubcategories.has(subcategory.id) && (
                                                    <div className="ml-4 pl-2 border-l border-gray-200">
                                                        {subcategory.documents.map((doc) => (
                                                            <button
                                                                key={doc.id}
                                                                onClick={() => setSelectedDoc(doc)}
                                                                className={`w-full flex items-center gap-2 px-2 py-1 hover:bg-blue-50 rounded text-left transition-colors ${selectedDoc?.id === doc.id ? 'bg-blue-100 text-blue-700' : ''}`}
                                                            >
                                                                <FileText className="w-3 h-3 text-gray-400" />
                                                                <span className="text-xs truncate">{doc.title}</span>
                                                            </button>
                                                        ))}
                                                        {subcategory.documents.length === 0 && (
                                                            <div className="px-2 py-1 text-xs text-gray-400 italic">ไม่มีเอกสาร</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {category.subcategories.length === 0 && (
                                            <div className="px-2 py-1 text-xs text-gray-400 italic">ไม่มีหมวดหมู่ย่อย</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Legacy Documents (flat structure) */}
                        {!hasTreeMenu && hasLegacyDocs && Object.entries(groupedLegacyDocs).map(([category, docs]) => (
                            <div key={category} className="mb-2">
                                <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase">{category}</div>
                                {docs.map((doc) => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setSelectedDoc(doc)}
                                        className={`w-full flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded text-left transition-colors ${selectedDoc?.id === doc.id ? 'bg-blue-100 text-blue-700' : ''}`}
                                    >
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm truncate">{doc.title}</span>
                                    </button>
                                ))}
                            </div>
                        ))}

                        {!hasTreeMenu && !hasLegacyDocs && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                ยังไม่มีคู่มือ
                            </div>
                        )}
                    </nav>
                </div>
            </aside>

            {/* Right Content - Document Viewer */}
            <main className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border p-8 min-h-[60vh]">
                    {selectedDoc ? (
                        <article>
                            <h1 className="text-3xl font-bold mb-6 text-gray-900">{selectedDoc.title}</h1>

                            {selectedDoc.videoUrl && (
                                <div className="mb-8">
                                    <iframe
                                        src={selectedDoc.videoUrl.replace("watch?v=", "embed/")}
                                        className="w-full h-[400px] rounded-lg shadow-lg"
                                        allowFullScreen
                                        title="Video"
                                    />
                                </div>
                            )}

                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
                            />
                        </article>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-10 h-10 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Documentation Library</h2>
                            <p className="text-gray-500 max-w-md">
                                เลือกหัวข้อจากเมนูด้านซ้ายเพื่อดูคู่มือการใช้งาน
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
