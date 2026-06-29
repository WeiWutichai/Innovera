'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, Save, X, Upload, FileText } from 'lucide-react';
import { getDocument, updateDocument } from '@/app/actions/document';
import { uploadImage } from '@/app/actions/upload';
import { sanitizeHtml } from '@/lib/sanitize';

interface DocumentEditorProps {
    documentId: string | null;
    productId: string;
    onClose: () => void;
}

export default function DocumentEditor({ documentId, productId, onClose }: DocumentEditorProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (documentId) {
            loadDocument();
        } else {
            setTitle('');
            setContent('');
            setVideoUrl('');
        }
    }, [documentId]);

    const loadDocument = async () => {
        if (!documentId) return;
        setLoading(true);
        try {
            const doc = await getDocument(documentId);
            if (doc) {
                setTitle(doc.title);
                setContent(doc.content);
                setVideoUrl(doc.videoUrl || '');
            }
        } catch (error) {
            console.error('Failed to load document:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!documentId || !title.trim()) return;
        setSaving(true);
        try {
            await updateDocument(documentId, { title, content, videoUrl: videoUrl || undefined });
            alert('บันทึกสำเร็จ!');
        } catch (error) {
            console.error('Failed to save document:', error);
            alert('เกิดข้อผิดพลาดในการบันทึก');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const imageUrl = await uploadImage(formData);

            // Insert image tag at cursor position
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const imageTag = `<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; height: auto;" />`;
                const newContent = content.substring(0, start) + imageTag + content.substring(end);
                setContent(newContent);
            } else {
                setContent(prev => prev + `\n<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; height: auto;" />\n`);
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const insertTag = (tagStart: string, tagEnd: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const newContent = content.substring(0, start) + tagStart + selectedText + tagEnd + content.substring(end);
        setContent(newContent);

        // Set cursor position after tag
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + tagStart.length, start + tagStart.length + selectedText.length);
        }, 0);
    };

    if (!documentId) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center h-full shadow-lg">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">เลือกเอกสารจากเมนูด้านซ้าย</p>
                    <p className="text-sm text-gray-500">หรือสร้างเอกสารใหม่โดยคลิกปุ่ม + ในหมวดหมู่ย่อย</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center h-full shadow-lg">
                <div className="text-gray-400">กำลังโหลด...</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
                <h3 className="font-bold text-gray-900">แก้ไขเอกสาร</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={saving || !title.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all shadow-lg shadow-indigo-500/25"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อเอกสาร</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        placeholder="ชื่อเอกสาร..."
                    />
                </div>

                {/* Video URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube)</label>
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>

                {/* Content Editor */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">เนื้อหา</label>

                    {/* Toolbar */}
                    <div className="flex items-center gap-1 mb-0 bg-gray-50 border border-gray-200 rounded-t-xl p-2">
                        <button
                            onClick={() => insertTag('<strong>', '</strong>')}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="ตัวหนา"
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => insertTag('<em>', '</em>')}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="ตัวเอียง"
                        >
                            <Italic className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="รายการ"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => insertTag('<a href="">', '</a>')}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="ลิงก์"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        <div className="h-5 w-px bg-gray-200 mx-1" />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="flex items-center gap-1.5 px-3 py-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                            title="แทรกรูปภาพ"
                        >
                            {uploadingImage ? (
                                <Upload className="w-4 h-4 animate-pulse" />
                            ) : (
                                <ImageIcon className="w-4 h-4" />
                            )}
                            <span className="text-xs font-medium">แทรกรูป</span>
                        </button>
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 bg-gray-50 border border-gray-200 border-t-0 rounded-b-xl p-4 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono text-sm resize-none"
                        placeholder="เนื้อหาเอกสาร (รองรับ HTML)..."
                    />
                    <p className="text-xs text-gray-400 mt-1">รองรับ HTML สำหรับการจัดรูปแบบและแทรกรูปภาพ</p>
                </div>

                {/* Preview */}
                {content && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ตัวอย่าง</label>
                        <div
                            className="bg-white border border-gray-200 text-gray-900 rounded-xl p-4 prose prose-sm max-w-none overflow-auto max-h-48"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
