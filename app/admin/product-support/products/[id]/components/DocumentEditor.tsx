'use client';

import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, Image as ImageIcon, Link as LinkIcon, Save, X, Upload } from 'lucide-react';
import { getDocument, updateDocument } from '@/app/actions/document';
import { uploadImage } from '@/app/actions/upload';

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
            <div className="bg-[#1E293B] rounded-lg border border-white/5 p-6 flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                    <p className="text-lg mb-2">เลือกเอกสารจากเมนูด้านซ้าย</p>
                    <p className="text-sm">หรือสร้างเอกสารใหม่โดยคลิกปุ่ม + ในหมวดหมู่ย่อย</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-[#1E293B] rounded-lg border border-white/5 p-6 flex items-center justify-center h-full">
                <div className="text-gray-400">กำลังโหลด...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#1E293B] rounded-lg border border-white/5 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white">แก้ไขเอกสาร</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        disabled={saving || !title.trim()}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อเอกสาร</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#0F172A] border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="ชื่อเอกสาร..."
                    />
                </div>

                {/* Video URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Video URL (YouTube)</label>
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-[#0F172A] border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>

                {/* Content Editor */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">เนื้อหา</label>

                    {/* Toolbar */}
                    <div className="flex items-center gap-1 mb-2 bg-[#0F172A] border border-white/10 rounded-t p-2">
                        <button
                            onClick={() => insertTag('<strong>', '</strong>')}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            title="ตัวหนา"
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => insertTag('<em>', '</em>')}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            title="ตัวเอียง"
                        >
                            <Italic className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            title="รายการ"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => insertTag('<a href="">', '</a>')}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                            title="ลิงก์"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        <div className="h-4 w-px bg-white/10 mx-1" />
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
                            className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                            title="แทรกรูปภาพ"
                        >
                            {uploadingImage ? (
                                <Upload className="w-4 h-4 animate-pulse" />
                            ) : (
                                <ImageIcon className="w-4 h-4" />
                            )}
                            <span className="text-xs">แทรกรูป</span>
                        </button>
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 bg-[#0F172A] border border-white/10 border-t-0 rounded-b p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm resize-none"
                        placeholder="เนื้อหาเอกสาร (รองรับ HTML)..."
                    />
                    <p className="text-xs text-gray-500 mt-1">รองรับ HTML สำหรับการจัดรูปแบบและแทรกรูปภาพ</p>
                </div>

                {/* Preview */}
                {content && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">ตัวอย่าง</label>
                        <div
                            className="bg-white text-gray-900 rounded p-4 prose prose-sm max-w-none overflow-auto max-h-48"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
