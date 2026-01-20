"use client";

import { useEffect, useState, useTransition } from "react";
import { getIssueById, acceptIssue, completeIssue, closeIssue, rejectIssue } from "@/app/actions/issue";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface IssueImage {
    id: string;
    url: string;
}

interface IssueDetail {
    id: string;
    title: string;
    description: string;
    status: string;
    supportStatus: string;
    userId: number;
    createdAt: Date;
    user: { name: string | null; email: string };
    product: { id: string; name: string } | null;
    images: IssueImage[];
}

export default function IssueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const id = params.id as string;
    const [issue, setIssue] = useState<IssueDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();
    const [actionSuccess, setActionSuccess] = useState("");

    const isOwner = session?.user?.role === 'OWNER' || session?.user?.role === 'ADMIN';
    const isIssueOwner = issue?.userId === parseInt(session?.user?.id || "0");

    useEffect(() => {
        async function fetchIssue() {
            try {
                const data = await getIssueById(id);
                setIssue(data as unknown as IssueDetail);
            } catch (err: any) {
                setError(err.message || "Failed to load issue");
            } finally {
                setLoading(false);
            }
        }
        fetchIssue();
    }, [id]);

    // Close lightbox on Escape key
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowRight" && lightboxIndex !== null && issue?.images) {
                setLightboxIndex((lightboxIndex + 1) % issue.images.length);
            }
            if (e.key === "ArrowLeft" && lightboxIndex !== null && issue?.images) {
                setLightboxIndex((lightboxIndex - 1 + issue.images.length) % issue.images.length);
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, issue?.images]);

    const handleAction = (action: () => Promise<any>, successMsg: string) => {
        startTransition(async () => {
            try {
                await action();
                setActionSuccess(successMsg);
                // Refresh data
                const data = await getIssueById(id);
                setIssue(data as unknown as IssueDetail);
                setTimeout(() => setActionSuccess(""), 3000);
            } catch (err: any) {
                setError(err.message);
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': case 'TODO': return 'bg-blue-500';
            case 'IN_PROGRESS': return 'bg-yellow-500';
            case 'PENDING_REVIEW': case 'COMPLETE': return 'bg-purple-500';
            case 'CLOSED': case 'COMPLETED': return 'bg-green-500';
            case 'REJECTED': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4B286D] border-t-transparent"></div>
            </div>
        );
    }

    if (error && !issue) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link href="/community/issues" className="text-[#4B286D] hover:underline font-bold">
                        ← Back to Issues
                    </Link>
                </div>
            </div>
        );
    }

    if (!issue) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <Link
                    href={issue.product ? `/community/issues/product/${issue.product.id}` : "/community/issues"}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#4B286D] mb-6 font-medium"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Issues
                </Link>

                {/* Success Message */}
                {actionSuccess && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg font-medium">
                        ✓ {actionSuccess}
                    </div>
                )}

                {/* Issue Card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#4B286D] p-8 text-white">
                        <div className="flex justify-between items-start gap-6">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{issue.title}</h1>
                                {issue.product && (
                                    <p className="text-purple-200 text-base">Product: {issue.product.name}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3 items-end shrink-0">
                                {/* User Status */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-purple-200">User Status:</span>
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full ${issue.status === 'OPEN' ? 'bg-green-500' :
                                            issue.status === 'PENDING_REVIEW' ? 'bg-purple-500' :
                                                issue.status === 'CLOSED' ? 'bg-gray-500' :
                                                    issue.status === 'REJECTED' ? 'bg-red-500' :
                                                        'bg-blue-500'
                                        } text-white`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {issue.status.replace('_', ' ')}
                                    </span>
                                </div>
                                {/* Support Status */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-purple-200">Support Status:</span>
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full ${(issue.supportStatus || 'TODO') === 'TODO' ? 'bg-blue-500' :
                                            (issue.supportStatus || 'TODO') === 'IN_PROGRESS' ? 'bg-yellow-500' :
                                                (issue.supportStatus || 'TODO') === 'COMPLETE' ? 'bg-purple-500' :
                                                    (issue.supportStatus || 'TODO') === 'COMPLETED' ? 'bg-green-500' :
                                                        (issue.supportStatus || 'TODO') === 'REJECTED' ? 'bg-red-500' :
                                                            'bg-gray-500'
                                        } text-white`}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                        {(issue.supportStatus || 'TODO').replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                        {/* Description */}
                        <div>
                            <h2 className="text-sm font-bold text-gray-700 mb-2">Description</h2>
                            <div className="bg-gray-50 p-4 rounded-lg text-gray-800 whitespace-pre-wrap">
                                {issue.description}
                            </div>
                        </div>

                        {/* Images */}
                        {issue.images && issue.images.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold text-gray-700 mb-3">Attachments ({issue.images.length})</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {issue.images.map((img, index) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setLightboxIndex(index)}
                                            className="block aspect-video rounded-lg border border-gray-200 overflow-hidden hover:border-[#4B286D] transition focus:outline-none focus:ring-2 focus:ring-[#4B286D]"
                                        >
                                            <img
                                                src={img.url}
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons for Owner/Support */}
                        {isOwner && (
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Support Actions</h3>
                                <div className="flex gap-3">
                                    {issue.supportStatus === 'TODO' && (
                                        <button
                                            onClick={() => handleAction(() => acceptIssue(issue.id), "Issue accepted! Status changed to In Progress.")}
                                            disabled={isPending}
                                            className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
                                        >
                                            {isPending ? "Processing..." : "Accept Task"}
                                        </button>
                                    )}
                                    {issue.supportStatus === 'IN_PROGRESS' && (
                                        <button
                                            onClick={() => handleAction(() => completeIssue(issue.id), "Issue marked complete! Waiting for user review.")}
                                            disabled={isPending}
                                            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                                        >
                                            {isPending ? "Processing..." : "Mark Complete"}
                                        </button>
                                    )}
                                    {(issue.supportStatus === 'COMPLETE' || issue.supportStatus === 'COMPLETED' || issue.supportStatus === 'REJECTED') && (
                                        <span className="text-gray-500 italic">No actions available</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons for User (Issue Reporter) */}
                        {isIssueOwner && issue.status === 'PENDING_REVIEW' && (
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Review Support's Fix</h3>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction(() => closeIssue(issue.id), "Issue closed! Thank you for your feedback.")}
                                        disabled={isPending}
                                        className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {isPending ? "Processing..." : "Accept & Close"}
                                    </button>
                                    <button
                                        onClick={() => handleAction(() => rejectIssue(issue.id), "Issue rejected. Support will be notified.")}
                                        disabled={isPending}
                                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        {isPending ? "Processing..." : "Reject Fix"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="border-t pt-4 flex justify-between text-sm text-gray-500">
                            <div>
                                <strong>Reported by:</strong> {issue.user?.name || issue.user?.email || "Unknown"}
                            </div>
                            <div>
                                <strong>Date:</strong> {new Date(issue.createdAt).toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && issue.images && issue.images[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-4 right-4 text-white/60 hover:text-white transition z-10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Navigation - Previous */}
                    {issue.images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((lightboxIndex - 1 + issue.images.length) % issue.images.length);
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition bg-black/30 rounded-full p-2"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <img
                        src={issue.images[lightboxIndex].url}
                        alt={`Attachment ${lightboxIndex + 1}`}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Navigation - Next */}
                    {issue.images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((lightboxIndex + 1) % issue.images.length);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition bg-black/30 rounded-full p-2"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
                        {lightboxIndex + 1} / {issue.images.length}
                    </div>
                </div>
            )}
        </div>
    );
}
