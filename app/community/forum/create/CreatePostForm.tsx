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

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Topic Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="What's this topic about?"
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <RichTextEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Provide more details..."
                        minHeight="300px"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title || !content}
                        className="bg-[#5B2C6F] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#4a235a] transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Posting...' : 'Create Post'}
                    </button>
                </div>
            </div>
        </div>
    );
}
