'use client';

import { useState } from 'react';
import TreeMenu from './TreeMenu';
import DocumentEditor from './DocumentEditor';

interface Document {
    id: string;
    title: string;
    content: string;
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

interface DocumentManagerProps {
    productId: string;
    categories: Category[];
}

export default function DocumentManager({ productId, categories }: DocumentManagerProps) {
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tree Menu - Left Side */}
            <div className="lg:col-span-1">
                <TreeMenu
                    productId={productId}
                    categories={categories}
                    selectedDocId={selectedDocId || undefined}
                    onSelectDocument={setSelectedDocId}
                />
            </div>

            {/* Document Editor - Right Side */}
            <div className="lg:col-span-2">
                <DocumentEditor
                    documentId={selectedDocId}
                    productId={productId}
                    onClose={() => setSelectedDocId(null)}
                />
            </div>
        </div>
    );
}
