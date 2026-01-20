'use client';

import { deletePost } from "@/app/actions/community";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function DeletePostButton({ postId }: { postId: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isConfirming, setIsConfirming] = useState(false);

    const handleDelete = () => {
        if (!isConfirming) {
            setIsConfirming(true);
            return;
        }

        startTransition(async () => {
            try {
                await deletePost(postId);
                router.push('/community/forum');
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('Failed to delete post');
            }
        });
    };

    return (
        <div className="flex items-center">
            {isConfirming ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-red-600 font-bold">Are you sure?</span>
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                        {isPending ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    <button
                        onClick={() => setIsConfirming(false)}
                        className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded text-sm"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                    title="Delete Post (Admin Only)"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            )}
        </div>
    );
}
