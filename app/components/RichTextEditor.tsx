'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Bold,
    ImagePlus,
    Italic,
    Link,
    List,
    ListOrdered,
    Quote,
    Redo2,
    Underline,
    Undo2,
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    onInteraction?: () => void;
    minHeight?: string;
    onImageUpload?: (file: File) => Promise<string>;
}

function escapeAttribute(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function isSafeUrl(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function fileToDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error || new Error("Unable to read image"));
        reader.readAsDataURL(file);
    });
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Add details...",
    readOnly = false,
    onInteraction,
    minHeight = "150px",
    onImageUpload,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const savedRangeRef = useRef<Range | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageError, setImageError] = useState("");

    const hasContent = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return false;
        return Boolean(editor.textContent?.trim()) || Boolean(editor.querySelector("img"));
    }, []);

    const syncValue = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;
        const html = hasContent() ? editor.innerHTML : "";
        setIsEmpty(!hasContent());
        onChange(html);
    }, [hasContent, onChange]);

    const saveSelection = useCallback(() => {
        const editor = editorRef.current;
        const selection = window.getSelection();
        if (!editor || !selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (editor.contains(range.commonAncestorContainer)) {
            savedRangeRef.current = range.cloneRange();
        }
    }, []);

    const restoreSelection = useCallback(() => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();
        const selection = window.getSelection();
        if (!selection) return;

        selection.removeAllRanges();
        if (savedRangeRef.current) {
            selection.addRange(savedRangeRef.current);
            return;
        }

        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        selection.addRange(range);
        savedRangeRef.current = range.cloneRange();
    }, []);

    const runCommand = useCallback((command: string, commandValue?: string) => {
        if (readOnly) return;
        restoreSelection();
        document.execCommand(command, false, commandValue);
        syncValue();
        saveSelection();
    }, [readOnly, restoreSelection, saveSelection, syncValue]);

    const insertHtml = useCallback((html: string) => {
        runCommand("insertHTML", html);
    }, [runCommand]);

    const addLink = useCallback(() => {
        const rawUrl = window.prompt("URL");
        if (!rawUrl) return;

        const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
        if (!isSafeUrl(normalizedUrl)) {
            setImageError("Invalid link URL");
            return;
        }

        setImageError("");
        runCommand("createLink", normalizedUrl);
    }, [runCommand]);

    const handleImageFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0 || readOnly) return;

        setImageError("");
        setIsUploadingImage(true);

        try {
            for (const file of Array.from(files)) {
                if (!file.type.startsWith("image/")) continue;
                const imageUrl = onImageUpload ? await onImageUpload(file) : await fileToDataUrl(file);
                insertHtml(`<img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(file.name)}">`);
            }
        } catch (error) {
            setImageError(error instanceof Error ? error.message : "Unable to insert image");
        } finally {
            setIsUploadingImage(false);
            if (imageInputRef.current) imageInputRef.current.value = "";
        }
    }, [insertHtml, onImageUpload, readOnly]);

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        if (value !== editor.innerHTML) {
            editor.innerHTML = value || "";
        }
        setIsEmpty(!hasContent());
    }, [hasContent, value]);

    const toolbarButtonClass = "h-8 w-8 inline-flex items-center justify-center rounded border border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4B286D]/20 disabled:opacity-40 disabled:cursor-not-allowed";

    return (
        <div onClick={onInteraction} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            {!readOnly && (
                <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-2 overflow-x-auto">
                    <button type="button" title="Bold" aria-label="Bold" className={toolbarButtonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("bold")}>
                        <Bold className="w-4 h-4" />
                    </button>
                    <button type="button" title="Italic" aria-label="Italic" className={toolbarButtonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("italic")}>
                        <Italic className="w-4 h-4" />
                    </button>
                    <button type="button" title="Underline" aria-label="Underline" className={toolbarButtonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("underline")}>
                        <Underline className="w-4 h-4" />
                    </button>
                    <span className="mx-1 h-5 w-px bg-gray-200" />
                    <button type="button" title="Bulleted list" aria-label="Bulleted list" className={toolbarButtonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("insertUnorderedList")}>
                        <List className="w-4 h-4" />
                    </button>
                    <button type="button" title="Numbered list" aria-label="Numbered list" className={toolbarButtonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("insertOrderedList")}>
                        <ListOrdered className="w-4 h-4" />
                    </button>
                    <button type="button" title="Quote" aria-label="Quote" className={toolbarButtonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("formatBlock", "blockquote")}>
                        <Quote className="w-4 h-4" />
                    </button>
                    <span className="mx-1 h-5 w-px bg-gray-200" />
                    <button type="button" title="Link" aria-label="Link" className={toolbarButtonClass} onMouseDown={(e) => e.preventDefault()} onClick={addLink}>
                        <Link className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        title="Insert image"
                        aria-label="Insert image"
                        className={toolbarButtonClass}
                        disabled={isUploadingImage}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <ImagePlus className="w-4 h-4" />
                    </button>
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(event) => handleImageFiles(event.target.files)}
                    />
                    <span className="mx-1 h-5 w-px bg-gray-200" />
                    <button type="button" title="Undo" aria-label="Undo" className={toolbarButtonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("undo")}>
                        <Undo2 className="w-4 h-4" />
                    </button>
                    <button type="button" title="Redo" aria-label="Redo" className={toolbarButtonClass} onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("redo")}>
                        <Redo2 className="w-4 h-4" />
                    </button>
                    {isUploadingImage && <span className="px-2 text-xs font-medium text-gray-500 whitespace-nowrap">Uploading...</span>}
                </div>
            )}

            <div className="relative">
                {isEmpty && (
                    <div className="pointer-events-none absolute left-4 top-3 text-gray-400 text-sm">
                        {placeholder}
                    </div>
                )}
                <div
                    ref={editorRef}
                    role="textbox"
                    aria-multiline="true"
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    className="rich-content w-full px-4 py-3 text-gray-700 outline-none overflow-y-auto"
                    style={{ minHeight }}
                    onInput={syncValue}
                    onBlur={saveSelection}
                    onFocus={saveSelection}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                    onPaste={() => window.setTimeout(syncValue, 0)}
                />
            </div>

            {imageError && (
                <div className="border-t border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {imageError}
                </div>
            )}
        </div>
    );
}
