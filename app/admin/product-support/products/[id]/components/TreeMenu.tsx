'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Trash2, Edit2, FileText, FolderOpen, Folder } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory, createSubcategory, updateSubcategory, deleteSubcategory } from '@/app/actions/docCategory';
import { createDocument, deleteDocument } from '@/app/actions/document';

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

interface TreeMenuProps {
    productId: string;
    categories: Category[];
    selectedDocId?: string;
    onSelectDocument: (docId: string | null) => void;
}

export default function TreeMenu({ productId, categories, selectedDocId, onSelectDocument }: TreeMenuProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories.map(c => c.id)));
    const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [addingType, setAddingType] = useState<{ type: 'category' | 'subcategory' | 'document'; parentId?: string } | null>(null);
    const [newName, setNewName] = useState('');

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

    const handleAddCategory = async () => {
        if (!newName.trim()) return;
        await createCategory({ name: newName.trim(), productId });
        setNewName('');
        setAddingType(null);
    };

    const handleAddSubcategory = async (categoryId: string) => {
        if (!newName.trim()) return;
        await createSubcategory({ name: newName.trim(), categoryId });
        setNewName('');
        setAddingType(null);
        setExpandedCategories(prev => new Set([...prev, categoryId]));
    };

    const handleAddDocument = async (subcategoryId: string) => {
        if (!newName.trim()) return;
        await createDocument({ title: newName.trim(), content: '', productId, subcategoryId });
        setNewName('');
        setAddingType(null);
        setExpandedSubcategories(prev => new Set([...prev, subcategoryId]));
    };

    const handleUpdateCategory = async (id: string) => {
        if (!editingName.trim()) return;
        await updateCategory(id, { name: editingName.trim() });
        setEditingId(null);
        setEditingName('');
    };

    const handleUpdateSubcategory = async (id: string) => {
        if (!editingName.trim()) return;
        await updateSubcategory(id, { name: editingName.trim() });
        setEditingId(null);
        setEditingName('');
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm('คุณต้องการลบหมวดหมู่นี้และข้อมูลทั้งหมดภายในหรือไม่?')) {
            await deleteCategory(id);
        }
    };

    const handleDeleteSubcategory = async (id: string) => {
        if (confirm('คุณต้องการลบหมวดหมู่ย่อยนี้และเอกสารทั้งหมดภายในหรือไม่?')) {
            await deleteSubcategory(id);
        }
    };

    const handleDeleteDocument = async (id: string) => {
        if (confirm('คุณต้องการลบเอกสารนี้หรือไม่?')) {
            await deleteDocument(id);
            if (selectedDocId === id) {
                onSelectDocument(null);
            }
        }
    };

    const startEditing = (id: string, name: string) => {
        setEditingId(id);
        setEditingName(name);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
                <h3 className="font-bold text-gray-900 mb-2">โครงสร้างเมนู</h3>
                <button
                    onClick={() => setAddingType({ type: 'category' })}
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    เพิ่มหมวดหมู่หลัก
                </button>
            </div>

            <div className="p-2 max-h-[60vh] overflow-y-auto">
                {/* Add Category Form */}
                {addingType?.type === 'category' && !addingType.parentId && (
                    <div className="px-2 py-1 mb-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="ชื่อหมวดหมู่..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddCategory();
                                if (e.key === 'Escape') { setAddingType(null); setNewName(''); }
                            }}
                        />
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleAddCategory} className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium">บันทึก</button>
                            <button onClick={() => { setAddingType(null); setNewName(''); }} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium">ยกเลิก</button>
                        </div>
                    </div>
                )}

                {categories.map((category) => (
                    <div key={category.id} className="mb-1">
                        {/* Category */}
                        <div className="flex items-center gap-1 px-2 py-2 hover:bg-gray-50 rounded-lg group">
                            <button onClick={() => toggleCategory(category.id)} className="text-gray-400 hover:text-gray-600">
                                {expandedCategories.has(category.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                            <span className="w-6 h-6 flex items-center justify-center rounded-md bg-amber-100">
                                {expandedCategories.has(category.id) ? <FolderOpen className="w-4 h-4 text-amber-600" /> : <Folder className="w-4 h-4 text-amber-600" />}
                            </span>

                            {editingId === category.id ? (
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-900"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdateCategory(category.id);
                                        if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                                    }}
                                    onBlur={() => handleUpdateCategory(category.id)}
                                />
                            ) : (
                                <span className="flex-1 text-sm text-gray-900 font-medium truncate">{category.name}</span>
                            )}

                            <div className="hidden group-hover:flex items-center gap-1">
                                <button onClick={() => setAddingType({ type: 'subcategory', parentId: category.id })} className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md" title="เพิ่มหมวดหมู่ย่อย">
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => startEditing(category.id, category.name)} className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-md" title="แก้ไข">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDeleteCategory(category.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md" title="ลบ">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Subcategories */}
                        {expandedCategories.has(category.id) && (
                            <div className="ml-5 pl-3 border-l-2 border-gray-100">
                                {/* Add Subcategory Form */}
                                {addingType?.type === 'subcategory' && addingType.parentId === category.id && (
                                    <div className="px-2 py-1 mb-1">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="ชื่อหมวดหมู่ย่อย..."
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddSubcategory(category.id);
                                                if (e.key === 'Escape') { setAddingType(null); setNewName(''); }
                                            }}
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => handleAddSubcategory(category.id)} className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium">บันทึก</button>
                                            <button onClick={() => { setAddingType(null); setNewName(''); }} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-medium">ยกเลิก</button>
                                        </div>
                                    </div>
                                )}

                                {category.subcategories.map((subcategory) => (
                                    <div key={subcategory.id} className="mb-1">
                                        {/* Subcategory */}
                                        <div className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-50 rounded-lg group">
                                            <button onClick={() => toggleSubcategory(subcategory.id)} className="text-gray-400 hover:text-gray-600">
                                                {expandedSubcategories.has(subcategory.id) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                            </button>
                                            <span className="w-5 h-5 flex items-center justify-center rounded-md bg-blue-50">
                                                {expandedSubcategories.has(subcategory.id) ? <FolderOpen className="w-3.5 h-3.5 text-blue-500" /> : <Folder className="w-3.5 h-3.5 text-blue-500" />}
                                            </span>

                                            {editingId === subcategory.id ? (
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-0.5 text-xs text-gray-900"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleUpdateSubcategory(subcategory.id);
                                                        if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                                                    }}
                                                    onBlur={() => handleUpdateSubcategory(subcategory.id)}
                                                />
                                            ) : (
                                                <span className="flex-1 text-xs text-gray-700 truncate">{subcategory.name}</span>
                                            )}

                                            <div className="hidden group-hover:flex items-center gap-1">
                                                <button onClick={() => setAddingType({ type: 'document', parentId: subcategory.id })} className="p-1 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded" title="เพิ่มเอกสาร">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => startEditing(subcategory.id, subcategory.name)} className="p-1 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded" title="แก้ไข">
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => handleDeleteSubcategory(subcategory.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded" title="ลบ">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        {expandedSubcategories.has(subcategory.id) && (
                                            <div className="ml-4 pl-2 border-l border-gray-100">
                                                {/* Add Document Form */}
                                                {addingType?.type === 'document' && addingType.parentId === subcategory.id && (
                                                    <div className="px-2 py-1 mb-1">
                                                        <input
                                                            type="text"
                                                            value={newName}
                                                            onChange={(e) => setNewName(e.target.value)}
                                                            placeholder="ชื่อเอกสาร..."
                                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 placeholder-gray-400"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleAddDocument(subcategory.id);
                                                                if (e.key === 'Escape') { setAddingType(null); setNewName(''); }
                                                            }}
                                                        />
                                                        <div className="flex gap-2 mt-1">
                                                            <button onClick={() => handleAddDocument(subcategory.id)} className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-lg font-medium">บันทึก</button>
                                                            <button onClick={() => { setAddingType(null); setNewName(''); }} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">ยกเลิก</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {subcategory.documents.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        className={`flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer group ${selectedDocId === doc.id ? 'bg-indigo-50 border border-indigo-200' : ''}`}
                                                        onClick={() => onSelectDocument(doc.id)}
                                                    >
                                                        <FileText className={`w-3.5 h-3.5 ${selectedDocId === doc.id ? 'text-indigo-500' : 'text-gray-400'}`} />
                                                        <span className={`flex-1 text-xs truncate ${selectedDocId === doc.id ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>{doc.title}</span>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }} className="hidden group-hover:block p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded" title="ลบ">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {subcategory.documents.length === 0 && !addingType && (
                                                    <div className="px-2 py-1 text-xs text-gray-400 italic">ไม่มีเอกสาร</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {category.subcategories.length === 0 && !addingType && (
                                    <div className="px-2 py-1 text-xs text-gray-400 italic">ไม่มีหมวดหมู่ย่อย</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {categories.length === 0 && !addingType && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        ยังไม่มีหมวดหมู่ คลิก "เพิ่มหมวดหมู่หลัก" เพื่อเริ่มต้น
                    </div>
                )}
            </div>
        </div>
    );
}
