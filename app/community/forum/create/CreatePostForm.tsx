'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/app/components/RichTextEditor';
import { createPost } from '@/app/actions/community';
import LoginModal from '@/app/components/LoginModal';

export default function CreatePostForm({ isLoggedIn }: { isLoggedIn: boolean }) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(!isLoggedIn);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isLoggedIn && !showLoginModal) {
        // Re-show modal if they closed it but are still not logged in?
        // Or just show a message.
    }

    const handleSubmit = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }
        if (!title.trim() || !content.trim()) return;

        setIsSubmitting(true);
        try {
            await createPost({ title, content });
            router.push('/community/forum');
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <LoginModal isOpen={showLoginModal} onClose={() => isLoggedIn ? setShowLoginModal(false) : router.back()} />

            <div className="space-y-8">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Topic Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What's this topic about?"
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-5 py-3 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-slate-400 text-slate-800"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Description</label>
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Provide more details..."
                            minHeight="350px"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title || !content}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
                    >
                        {isSubmitting ? 'Publishing...' : 'Create Topic'}
                    </button>
                </div>
            </div>
        </div>
    );
}
