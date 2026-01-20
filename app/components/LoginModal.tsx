'use client';

import { useRouter } from 'next/navigation';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Login to the community</h2>
                    <p className="text-gray-600 mb-6 text-sm">Log in with SSO</p>

                    <button
                        onClick={() => router.push('/login')}
                        className="w-full bg-[#7B3F9F] text-white py-3 px-4 rounded font-bold hover:bg-[#6a358a] transition-colors shadow-sm"
                    >
                        Login with Account
                    </button>
                </div>
            </div>
        </div>
    );
}
