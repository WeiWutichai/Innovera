'use client';

import { useState } from 'react';
import LoginModal from '@/app/components/LoginModal';
import RichTextEditor from '@/app/components/RichTextEditor';
import { createComment } from "@/app/actions/community";

interface ReplySectionProps {
    postId: string;
    isLoggedIn: boolean;
}

export default function ReplySection({ postId, isLoggedIn }: ReplySectionProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [content, setContent] = useState('');

    const handleInteraction = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        }
    };

    const handleSubmit = async () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }
        if (!content.trim()) return;

        await createComment(postId, content);
        setContent('');
        // Ideally trigger a refresh or use optimistic updates
        window.location.reload();
    };

    return (
        <div className="mt-8">
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            <div className="border rounded-t-lg bg-gray-50 border-b-0 p-4">
                <h3 className="text-lg font-bold text-gray-800">Reply</h3>
            </div>

            <div className="bg-white">
                <RichTextEditor
                    value={content}
                    onChange={setContent}
                    onInteraction={handleInteraction}
                    readOnly={!isLoggedIn}
                    placeholder="Add as many details as possible..."
                    minHeight="150px"
                />

                <div className="p-4 bg-gray-50 border rounded-b-lg border-t-0 flex justify-between items-center">
                    <button
                        onClick={handleSubmit}
                        className="bg-[#5B2C6F] text-white px-6 py-2 rounded font-medium hover:bg-[#4a235a] transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
