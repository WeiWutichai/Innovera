"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { getIssueById, acceptIssue, completeIssue, closeIssue, rejectIssue, resubmitIssue, addIssueComment, getIssueComments, deleteIssue } from "@/app/actions/issue";
import { markIssueNotificationsAsRead } from "@/app/actions/notification";
import { uploadImage } from "@/app/actions/upload";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface IssueImage {
    id: string;
    url: string;
}

interface IssueComment {
    id: string;
    content: string;
    type: string;
    createdAt: Date;
    user: { name: string | null; email: string };
    images: { id: string; url: string }[];
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
    activities?: {
        id: string;
        type: string;
        description: string;
        createdAt: Date;
        user: { name: string | null; email: string } | null;
        actorName: string | null;
    }[];
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

    // Comment system state
    const [comments, setComments] = useState<IssueComment[]>([]);
    const [showCommentForm, setShowCommentForm] = useState<'REJECTION' | 'RESUBMIT' | null>(null);
    const [commentText, setCommentText] = useState("");
    const [commentImages, setCommentImages] = useState<File[]>([]);
    const [uploadingComment, setUploadingComment] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isOwner = session?.user?.role === 'OWNER' || session?.user?.role === 'ADMIN';
    const isIssueOwner = issue?.userId === parseInt(session?.user?.id || "0");

    // Mark notifications as read when viewing the issue
    useEffect(() => {
        if (!id || !issue) return;

        // If Owner/Admin hasn't accepted the task yet (status TODO), keep notification
        if (isOwner && issue.supportStatus === 'TODO') {
            return;
        }

        // If User hasn't verified the task yet (status PENDING_REVIEW), keep notification
        if (isIssueOwner && issue.status === 'PENDING_REVIEW') {
            return;
        }

        markIssueNotificationsAsRead(id)
            .catch(err => console.error("Failed to mark notifications as read:", err));
    }, [id, issue, isOwner, isIssueOwner]);

    useEffect(() => {
        async function fetchIssue() {
            try {
                const data = await getIssueById(id);
                setIssue(data as unknown as IssueDetail);
                // Fetch comments
                const commentsData = await getIssueComments(id);
                setComments(commentsData as unknown as IssueComment[]);
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
                const commentsData = await getIssueComments(id);
                setComments(commentsData as unknown as IssueComment[]);
                setTimeout(() => setActionSuccess(""), 3000);
            } catch (err: any) {
                setError(err.message);
            }
        });
    };

    const handleSubmitComment = async (type: 'REJECTION' | 'RESUBMIT', statusAction: () => Promise<any>) => {
        if (!commentText.trim()) {
            setError("Please enter a comment");
            return;
        }

        setUploadingComment(true);
        try {
            // Upload images first
            const imageUrls: string[] = [];
            for (const file of commentImages) {
                const formData = new FormData();
                formData.append('file', file);
                const url = await uploadImage(formData);
                if (url) imageUrls.push(url);
            }

            // Add comment
            await addIssueComment({
                issueId: id,
                content: commentText,
                type,
                imageUrls
            });

            // Then perform the status action
            await statusAction();

            // Reset form
            setCommentText("");
            setCommentImages([]);
            setShowCommentForm(null);
            setActionSuccess(type === 'REJECTION' ? "Issue rejected with feedback" : "Issue resubmitted with response");

            // Refresh data
            const data = await getIssueById(id);
            setIssue(data as unknown as IssueDetail);
            const commentsData = await getIssueComments(id);
            setComments(commentsData as unknown as IssueComment[]);
            setTimeout(() => setActionSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploadingComment(false);
        }
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

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg font-medium">
                        ❌ {error}
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
                                    {issue.supportStatus === 'REJECTED' && (
                                        <button
                                            onClick={() => setShowCommentForm('RESUBMIT')}
                                            disabled={isPending}
                                            className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                                        >
                                            Respond & Resubmit
                                        </button>
                                    )}
                                    {(issue.supportStatus === 'COMPLETE' || issue.supportStatus === 'COMPLETED') && (
                                        <span className="text-gray-500 italic">Waiting for user review</span>
                                    )}

                                    {/* Admin Delete Action */}
                                    {session?.user?.role === 'ADMIN' && (
                                        <div className="ml-auto flex items-center gap-2">
                                            {!showDeleteConfirm ? (
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    disabled={isPending}
                                                    className="px-4 py-2 bg-red-600/10 text-red-600 border border-red-600/20 font-bold rounded-lg hover:bg-red-600 hover:text-white transition disabled:opacity-50"
                                                >
                                                    Delete Issue
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                                                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Are you sure?</span>
                                                    <button
                                                        onClick={() => {
                                                            startTransition(async () => {
                                                                try {
                                                                    setError("");
                                                                    const res = await deleteIssue(issue.id);
                                                                    if (res.success) {
                                                                        setActionSuccess("Issue deleted successfully.");
                                                                        setTimeout(() => {
                                                                            router.push(issue.product ? `/community/issues/product/${issue.product.id}` : "/community/issues");
                                                                        }, 800);
                                                                    }
                                                                } catch (err: any) {
                                                                    setError(err.message || "Something went wrong during deletion");
                                                                    setShowDeleteConfirm(false);
                                                                }
                                                            });
                                                        }}
                                                        disabled={isPending}
                                                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 shadow-sm"
                                                    >
                                                        {isPending ? "Deleting..." : "Yes, Delete"}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(false)}
                                                        disabled={isPending}
                                                        className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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
                                        onClick={() => setShowCommentForm('REJECTION')}
                                        disabled={isPending}
                                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                    >
                                        Reject with Reason
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Comment Form Modal */}
                        {showCommentForm && (
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">
                                    {showCommentForm === 'REJECTION' ? 'Reason for Rejection' : 'Response & Fix Details'}
                                </h3>
                                <div className="space-y-4">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder={showCommentForm === 'REJECTION'
                                            ? "Please describe what's wrong and what you expected..."
                                            : "Describe what was fixed and any additional notes..."}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4B286D] focus:border-transparent min-h-[120px] text-gray-900"
                                    />

                                    {/* Image Upload */}
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                setCommentImages(prev => [...prev, ...files]);
                                            }}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Attach Images
                                        </button>

                                        {/* Image Preview */}
                                        {commentImages.length > 0 && (
                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {commentImages.map((file, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`Preview ${idx + 1}`}
                                                            className="w-16 h-16 object-cover rounded border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setCommentImages(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleSubmitComment(
                                                showCommentForm,
                                                showCommentForm === 'REJECTION'
                                                    ? () => rejectIssue(issue.id)
                                                    : () => resubmitIssue(issue.id)
                                            )}
                                            disabled={uploadingComment || !commentText.trim()}
                                            className={`px-4 py-2 text-white font-bold rounded-lg transition disabled:opacity-50 ${showCommentForm === 'REJECTION'
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-orange-500 hover:bg-orange-600'
                                                }`}
                                        >
                                            {uploadingComment ? "Submitting..." : showCommentForm === 'REJECTION' ? "Submit Rejection" : "Submit & Resubmit"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowCommentForm(null);
                                                setCommentText("");
                                                setCommentImages([]);
                                            }}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comments Thread */}
                        {comments.length > 0 && (
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Conversation History ({comments.length})</h3>
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className={`p-4 rounded-lg ${comment.type === 'REJECTION'
                                                ? 'bg-red-50 border-l-4 border-red-500'
                                                : 'bg-orange-50 border-l-4 border-orange-500'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${comment.type === 'REJECTION'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {comment.type === 'REJECTION' ? 'User Rejection' : 'Support Response'}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {comment.user?.name || comment.user?.email}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-400" suppressHydrationWarning>
                                                    {new Date(comment.createdAt).toLocaleString('th-TH', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    })}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>

                                            {/* Comment Images */}
                                            {comment.images && comment.images.length > 0 && (
                                                <div className="flex gap-2 mt-3 flex-wrap">
                                                    {comment.images.map((img) => (
                                                        <img
                                                            key={img.id}
                                                            src={img.url}
                                                            alt="Attachment"
                                                            className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80 transition"
                                                            onClick={() => window.open(img.url, '_blank')}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Activity Log */}
                        {issue.activities && issue.activities.length > 0 && (
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-bold text-gray-700 mb-4">Activity Log</h3>
                                <div className="space-y-4">
                                    {issue.activities.map((activity) => (
                                        <div key={activity.id} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'CREATED' ? 'bg-green-500' :
                                                    activity.type === 'STATUS_CHANGE' ? 'bg-blue-500' :
                                                        activity.type === 'COMMENTED' ? 'bg-purple-500' :
                                                            'bg-gray-400'
                                                    }`} />
                                                <div className="w-0.5 h-full bg-gray-100" />
                                            </div>
                                            <div className="pb-4">
                                                <p className="text-sm text-gray-800">
                                                    <span className="font-bold">{activity.actorName || activity.user?.name || activity.user?.email || 'System'}</span>
                                                    {' '}{activity.description}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1" suppressHydrationWarning>
                                                    {new Date(activity.createdAt).toLocaleString('th-TH', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
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
