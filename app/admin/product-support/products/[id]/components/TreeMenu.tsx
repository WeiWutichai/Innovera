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
        <div className="bg-[#1E293B] rounded-lg border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-white mb-2">โครงสร้างเมนู</h3>
                <button
                    onClick={() => setAddingType({ type: 'category' })}
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
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
                            className="w-full bg-[#0F172A] border border-white/20 rounded px-2 py-1 text-sm text-white placeholder-gray-500"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddCategory();
                                if (e.key === 'Escape') { setAddingType(null); setNewName(''); }
                            }}
                        />
                        <div className="flex gap-1 mt-1">
                            <button onClick={handleAddCategory} className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">บันทึก</button>
                            <button onClick={() => { setAddingType(null); setNewName(''); }} className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded">ยกเลิก</button>
                        </div>
                    </div>
                )}

                {categories.map((category) => (
                    <div key={category.id} className="mb-1">
                        {/* Category */}
                        <div className="flex items-center gap-1 px-2 py-1.5 hover:bg-white/5 rounded group">
                            <button onClick={() => toggleCategory(category.id)} className="text-gray-400 hover:text-white">
                                {expandedCategories.has(category.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                            {expandedCategories.has(category.id) ? <FolderOpen className="w-4 h-4 text-yellow-500" /> : <Folder className="w-4 h-4 text-yellow-500" />}

                            {editingId === category.id ? (
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="flex-1 bg-[#0F172A] border border-white/20 rounded px-2 py-0.5 text-sm text-white"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdateCategory(category.id);
                                        if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                                    }}
                                    onBlur={() => handleUpdateCategory(category.id)}
                                />
                            ) : (
                                <span className="flex-1 text-sm text-white font-medium truncate">{category.name}</span>
                            )}

                            <div className="hidden group-hover:flex items-center gap-1">
                                <button onClick={() => setAddingType({ type: 'subcategory', parentId: category.id })} className="p-1 text-gray-400 hover:text-green-400" title="เพิ่มหมวดหมู่ย่อย">
                                    <Plus className="w-3 h-3" />
                                </button>
                                <button onClick={() => startEditing(category.id, category.name)} className="p-1 text-gray-400 hover:text-blue-400" title="แก้ไข">
                                    <Edit2 className="w-3 h-3" />
                                </button>
                                <button onClick={() => handleDeleteCategory(category.id)} className="p-1 text-gray-400 hover:text-red-400" title="ลบ">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Subcategories */}
                        {expandedCategories.has(category.id) && (
                            <div className="ml-4 pl-2 border-l border-white/10">
                                {/* Add Subcategory Form */}
                                {addingType?.type === 'subcategory' && addingType.parentId === category.id && (
                                    <div className="px-2 py-1 mb-1">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="ชื่อหมวดหมู่ย่อย..."
                                            className="w-full bg-[#0F172A] border border-white/20 rounded px-2 py-1 text-sm text-white placeholder-gray-500"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleAddSubcategory(category.id);
                                                if (e.key === 'Escape') { setAddingType(null); setNewName(''); }
                                            }}
                                        />
                                        <div className="flex gap-1 mt-1">
                                            <button onClick={() => handleAddSubcategory(category.id)} className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">บันทึก</button>
                                            <button onClick={() => { setAddingType(null); setNewName(''); }} className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded">ยกเลิก</button>
                                        </div>
                                    </div>
                                )}

                                {category.subcategories.map((subcategory) => (
                                    <div key={subcategory.id} className="mb-1">
                                        {/* Subcategory */}
                                        <div className="flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded group">
                                            <button onClick={() => toggleSubcategory(subcategory.id)} className="text-gray-400 hover:text-white">
                                                {expandedSubcategories.has(subcategory.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                            </button>
                                            {expandedSubcategories.has(subcategory.id) ? <FolderOpen className="w-3 h-3 text-blue-400" /> : <Folder className="w-3 h-3 text-blue-400" />}

                                            {editingId === subcategory.id ? (
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="flex-1 bg-[#0F172A] border border-white/20 rounded px-2 py-0.5 text-xs text-white"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleUpdateSubcategory(subcategory.id);
                                                        if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                                                    }}
                                                    onBlur={() => handleUpdateSubcategory(subcategory.id)}
                                                />
                                            ) : (
                                                <span className="flex-1 text-xs text-gray-300 truncate">{subcategory.name}</span>
                                            )}

                                            <div className="hidden group-hover:flex items-center gap-1">
                                                <button onClick={() => setAddingType({ type: 'document', parentId: subcategory.id })} className="p-1 text-gray-400 hover:text-green-400" title="เพิ่มเอกสาร">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => startEditing(subcategory.id, subcategory.name)} className="p-1 text-gray-400 hover:text-blue-400" title="แก้ไข">
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button onClick={() => handleDeleteSubcategory(subcategory.id)} className="p-1 text-gray-400 hover:text-red-400" title="ลบ">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        {expandedSubcategories.has(subcategory.id) && (
                                            <div className="ml-4 pl-2 border-l border-white/10">
                                                {/* Add Document Form */}
                                                {addingType?.type === 'document' && addingType.parentId === subcategory.id && (
                                                    <div className="px-2 py-1 mb-1">
                                                        <input
                                                            type="text"
                                                            value={newName}
                                                            onChange={(e) => setNewName(e.target.value)}
                                                            placeholder="ชื่อเอกสาร..."
                                                            className="w-full bg-[#0F172A] border border-white/20 rounded px-2 py-1 text-xs text-white placeholder-gray-500"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleAddDocument(subcategory.id);
                                                                if (e.key === 'Escape') { setAddingType(null); setNewName(''); }
                                                            }}
                                                        />
                                                        <div className="flex gap-1 mt-1">
                                                            <button onClick={() => handleAddDocument(subcategory.id)} className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">บันทึก</button>
                                                            <button onClick={() => { setAddingType(null); setNewName(''); }} className="text-xs bg-gray-600 text-white px-2 py-0.5 rounded">ยกเลิก</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {subcategory.documents.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        className={`flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded cursor-pointer group ${selectedDocId === doc.id ? 'bg-blue-600/20 border-l-2 border-blue-500' : ''}`}
                                                        onClick={() => onSelectDocument(doc.id)}
                                                    >
                                                        <FileText className="w-3 h-3 text-gray-400" />
                                                        <span className="flex-1 text-xs text-gray-400 truncate">{doc.title}</span>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }} className="hidden group-hover:block p-1 text-gray-400 hover:text-red-400" title="ลบ">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {subcategory.documents.length === 0 && !addingType && (
                                                    <div className="px-2 py-1 text-xs text-gray-500 italic">ไม่มีเอกสาร</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {category.subcategories.length === 0 && !addingType && (
                                    <div className="px-2 py-1 text-xs text-gray-500 italic">ไม่มีหมวดหมู่ย่อย</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {categories.length === 0 && !addingType && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        ยังไม่มีหมวดหมู่ คลิก "เพิ่มหมวดหมู่หลัก" เพื่อเริ่มต้น
                    </div>
                )}
            </div>
        </div>
    );
}
