'use client';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    onInteraction?: () => void;
    minHeight?: string;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Add details...",
    readOnly = false,
    onInteraction,
    minHeight = "150px"
}: RichTextEditorProps) {
    return (
        <div onClick={onInteraction} className="p-4 border rounded-lg bg-white">
            {/* Fake Toolbar */}
            <div className="flex items-center space-x-4 border-b pb-2 mb-2 text-gray-500 overflow-x-auto">
                <div className="flex items-center space-x-1 border-r pr-2 shadow-sm flex-shrink-0">
                    <span className="text-xs font-medium">Styles</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
                <div className="flex space-x-3 flex-shrink-0">
                    <button type="button" className="hover:text-black font-bold">B</button>
                    <button type="button" className="hover:text-black italic">I</button>
                    <button type="button" className="hover:text-black underline">U</button>
                    <button type="button" className="hover:text-black text-blue-500">A</button>
                    <span className="border-l mx-2 h-4 block"></span>
                    <button type="button" className="hover:text-black"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
                    <button type="button" className="hover:text-black"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg></button>
                    <span className="border-l mx-2 h-4 block"></span>
                    <button type="button" className="hover:text-black">😊</button>
                    <button type="button" className="hover:text-black">🔗</button>
                    <button type="button" className="hover:text-black">🖼️</button>
                    <button type="button" className="hover:text-black">❝</button>
                    <button type="button" className="hover:text-black">•••</button>
                </div>
            </div>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full resize-none outline-none text-gray-600 bg-transparent placeholder-gray-300"
                style={{ minHeight }}
                readOnly={readOnly}
            />
        </div>
    );
}
