"use client";

import { useEffect, useState, useTransition, useRef, useMemo } from "react";
import { getIssueById, acceptIssue, completeIssue, closeIssue, rejectIssue, resubmitIssue, addIssueComment, getIssueComments, deleteIssue, updateIssuePriority, setIssueSchedule, updateIssueTags, updateIssueComment, deleteIssueComment } from "@/app/actions/issue";
import { getTags, createTag } from "@/app/actions/tag";
import { markIssueNotificationsAsRead } from "@/app/actions/notification";
import { uploadImage } from "@/app/actions/upload";
import { formatTicketNumber, isDueDatePast, DUE_DATE_LOCALE_OPTIONS, tagBadgeClasses, TAG_COLORS } from "@/lib/constants";

const TAG_COLOR_OPTIONS = Object.keys(TAG_COLORS);
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { sanitizeClientHtml } from "@/lib/sanitize-client";

interface IssueImage {
    id: string;
    url: string;
}

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface IssueComment {
    id: string;
    content: string;
    type: string;
    userId: number;
    createdAt: Date;
    updatedAt?: Date | string | null;
    user: { name: string | null; email: string };
    images: { id: string; url: string }[];
}

interface IssueDetail {
    id: string;
    ticketNumber: number;
    title: string;
    description: string;
    status: string;
    supportStatus: string;
    priority: string;
    startDate: Date | string | null;
    dueDate: Date | string | null;
    tags: Tag[];
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

const PRIORITY_ORDER = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

// Solid badge colors, matching the live header convention (bg-{color}-500 + white).
const PRIORITY_SOLID: Record<string, string> = {
    LOW: 'bg-gray-400',
    MEDIUM: 'bg-teal-500',
    HIGH: 'bg-orange-500',
    URGENT: 'bg-red-600',
};

export default function IssueDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const id = params.id as string;
    const [issue, setIssue] = useState<IssueDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();
    const [actionSuccess, setActionSuccess] = useState("");

    // Comment system state
    const [comments, setComments] = useState<IssueComment[]>([]);
    const [showCommentForm, setShowCommentForm] = useState<'REJECTION' | 'RESUBMIT' | 'COMPLETE' | null>(null);
    const [commentText, setCommentText] = useState("");
    const [commentImages, setCommentImages] = useState<File[]>([]);
    const commentImageUrls = useMemo(() => commentImages.map(f => URL.createObjectURL(f)), [commentImages]);
    useEffect(() => {
        return () => { commentImageUrls.forEach(url => URL.revokeObjectURL(url)); };
    }, [commentImageUrls]);
    const [uploadingComment, setUploadingComment] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Schedule pickers (support/admin control), kept in sync with the loaded
    // issue. The effects key on the STRING form: the dates arrive as fresh
    // Date objects on every refetch, so keying on the objects themselves would
    // reset an unsaved picker selection after any unrelated action.
    const [startDateInput, setStartDateInput] = useState("");
    const [dueDateInput, setDueDateInput] = useState("");
    const storedStartDate = issue?.startDate ? new Date(issue.startDate).toISOString().split('T')[0] : "";
    const storedDueDate = issue?.dueDate ? new Date(issue.dueDate).toISOString().split('T')[0] : "";
    useEffect(() => {
        setStartDateInput(storedStartDate);
    }, [storedStartDate]);
    useEffect(() => {
        setDueDateInput(storedDueDate);
    }, [storedDueDate]);
    const scheduleChanged = startDateInput !== storedStartDate || dueDateInput !== storedDueDate;
    const scheduleInvalid = !!startDateInput && !!dueDateInput && startDateInput > dueDateInput;

    // Tag editor (support/admin control). The catalogue is fetched once; the
    // selection is seeded from the issue and kept in sync via the string key so
    // an unsaved selection isn't reset by unrelated refetches.
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const storedTagKey = (issue?.tags || []).map(t => t.id).sort().join(',');
    useEffect(() => {
        setSelectedTagIds(storedTagKey ? storedTagKey.split(',') : []);
    }, [storedTagKey]);
    const tagsChanged = selectedTagIds.slice().sort().join(',') !== storedTagKey;
    function toggleTag(tagId: string) {
        setSelectedTagIds(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    }

    // New-tag creation (admin only): add a tag to the shared catalogue.
    const [showNewTag, setShowNewTag] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("slate");
    const [creatingTag, setCreatingTag] = useState(false);

    const handleCreateTag = async () => {
        const name = newTagName.trim();
        if (!name) return;
        setCreatingTag(true);
        try {
            const created = await createTag({ name, color: newTagColor });
            const fresh = await getTags();
            setAllTags(fresh);
            // Pre-select the new tag so a following "Save Tags" attaches it.
            setSelectedTagIds(prev => (prev.includes(created.id) ? prev : [...prev, created.id]));
            setNewTagName("");
            setNewTagColor("slate");
            setShowNewTag(false);
            setActionSuccess(`Tag "${created.name}" created`);
            setTimeout(() => setActionSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCreatingTag(false);
        }
    };

    // Comment edit state: which comment is open for editing, and its draft body.
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentText, setEditingCommentText] = useState("");
    const [savingComment, setSavingComment] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
    const [confirmDeleteCommentId, setConfirmDeleteCommentId] = useState<string | null>(null);

    // Free-form message composer (two-way Q&A, available at any status)
    const [messageText, setMessageText] = useState("");
    const [messageImages, setMessageImages] = useState<File[]>([]);
    const messageImageUrls = useMemo(() => messageImages.map(f => URL.createObjectURL(f)), [messageImages]);
    useEffect(() => {
        return () => { messageImageUrls.forEach(url => URL.revokeObjectURL(url)); };
    }, [messageImageUrls]);
    const [sendingMessage, setSendingMessage] = useState(false);
    const messageFileRef = useRef<HTMLInputElement>(null);

    const isOwner = session?.user?.role === 'OWNER' || session?.user?.role === 'ADMIN';
    const isIssueOwner = issue?.userId === parseInt(session?.user?.id || "0");
    const selfUserId = parseInt(session?.user?.id || "0");
    const isAdmin = session?.user?.role === 'ADMIN';
    const sanitizedDescription = useMemo(() => {
        const html = sanitizeClientHtml(issue?.description || "");
        return /<[a-z][\s\S]*>/i.test(html) ? html : html.replace(/\n/g, "<br>");
    }, [issue?.description]);

    // Staff need the full tag catalogue to edit an issue's tags.
    useEffect(() => {
        if (!isOwner) return;
        getTags().then(setAllTags).catch(() => setAllTags([]));
    }, [isOwner]);

    // Handle authentication and fetching
    useEffect(() => {
        if (status === "unauthenticated") {
            const currentPath = window.location.pathname;
            const safePath = currentPath.startsWith('/') && !currentPath.startsWith('//') ? currentPath : '/';
            router.push(`/login?callbackUrl=${encodeURIComponent(safePath)}`);
            return;
        }

        if (status === "authenticated" && id) {
            fetchIssue();
        }
    }, [status, id, router]);

    async function fetchIssue() {
        setLoading(true);
        try {
            const data = await getIssueById(id);
            if (!data) {
                setError("Issue not found or unauthorized");
                return;
            }
            setIssue(data as unknown as IssueDetail);
            // Fetch comments
            const commentsData = await getIssueComments(id);
            setComments(commentsData as unknown as IssueComment[]);
        } catch (err: any) {
            console.error("Error fetching issue:", err);
            if (err.message === "Unauthorized") {
                const currentPath = window.location.pathname;
                router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
            } else {
                setError(err.message || "Failed to load issue");
            }
        } finally {
            setLoading(false);
        }
    }

    // Mark notifications as read when viewing the issue.
    useEffect(() => {
        if (!id || !issue || !session) return;

        // Preserve the single "action needed" reminder (keep it unread) until the
        // user takes that action, but always clear message/comment notifications so
        // a back-and-forth conversation doesn't leave a stale unread badge.
        let exceptTypes: string[] | undefined;
        if (isOwner && issue.supportStatus === 'TODO') {
            // Dev hasn't accepted the task yet — keep the "New Issue Reported" reminder.
            exceptTypes = ['ISSUE_CREATED'];
        } else if (isIssueOwner && issue.status === 'PENDING_REVIEW') {
            // Reporter hasn't reviewed the fix yet — keep the "Issue Completed" reminder.
            exceptTypes = ['ISSUE_COMPLETE'];
        }

        markIssueNotificationsAsRead(id, exceptTypes)
            .catch(err => console.error("Failed to mark notifications as read:", err));
    }, [id, issue, isOwner, isIssueOwner, session]);

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

    const handleSubmitComment = async (type: 'REJECTION' | 'RESUBMIT' | 'COMPLETE', statusAction: () => Promise<any>) => {
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

            // Add comment (skip for COMPLETE as completeIssue handles it)
            if (type !== 'COMPLETE') {
                await addIssueComment({
                    issueId: id,
                    content: commentText,
                    type,
                    imageUrls
                });
            }

            // Then perform the status action (for COMPLETE, pass imageUrls via statusAction)
            if (type === 'COMPLETE') {
                await completeIssue(id, { message: commentText, imageUrls });
            } else {
                await statusAction();
            }

            // Reset form
            setCommentText("");
            setCommentImages([]);
            setShowCommentForm(null);

            const successMessages: Record<string, string> = {
                'REJECTION': "Issue rejected with feedback",
                'RESUBMIT': "Issue resubmitted with response",
                'COMPLETE': "Issue marked complete with resolution notes"
            };
            setActionSuccess(successMessages[type]);

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

    const handleSendMessage = async () => {
        if (!messageText.trim()) {
            setError("Please enter a message");
            return;
        }

        setSendingMessage(true);
        try {
            // Upload any attached images first
            const imageUrls: string[] = [];
            for (const file of messageImages) {
                const formData = new FormData();
                formData.append('file', file);
                const url = await uploadImage(formData);
                if (url) imageUrls.push(url);
            }

            await addIssueComment({
                issueId: id,
                content: messageText,
                type: 'MESSAGE',
                imageUrls,
            });

            // Reset composer
            setMessageText("");
            setMessageImages([]);
            setActionSuccess("Message sent");

            // Refresh conversation + activity log
            const commentsData = await getIssueComments(id);
            setComments(commentsData as unknown as IssueComment[]);
            const data = await getIssueById(id);
            setIssue(data as unknown as IssueDetail);
            setTimeout(() => setActionSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSendingMessage(false);
        }
    };

    const startEditingComment = (comment: IssueComment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.content);
    };

    const cancelEditingComment = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
    };

    const saveEditedComment = async () => {
        if (!editingCommentId || !editingCommentText.trim()) {
            setError("Comment cannot be empty");
            return;
        }
        setSavingComment(true);
        try {
            await updateIssueComment({ commentId: editingCommentId, content: editingCommentText });
            cancelEditingComment();
            setActionSuccess("Comment updated");
            const commentsData = await getIssueComments(id);
            setComments(commentsData as unknown as IssueComment[]);
            setTimeout(() => setActionSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSavingComment(false);
        }
    };

    const removeComment = async (commentId: string) => {
        setDeletingCommentId(commentId);
        try {
            await deleteIssueComment(commentId);
            setActionSuccess("Comment deleted");
            const commentsData = await getIssueComments(id);
            setComments(commentsData as unknown as IssueComment[]);
            setTimeout(() => setActionSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDeletingCommentId(null);
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-r-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
            </div>
        );
    }

    if (error && !issue) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-rose-100 to-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Issue</h1>
                        <p className="text-gray-600 mb-8">{error}</p>
                        <Link
                            href="/community/issues"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Issues
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!issue) return null;

    // Overdue = past the end of the due day (UTC) while the issue still needs
    // support work. REJECTED is deliberately NOT terminal: a reporter rejecting
    // the fix puts the issue back into active rework. COMPLETE/COMPLETED mean
    // the ball is in the reporter's court.
    const isDone = issue.status === 'CLOSED'
        || ['COMPLETE', 'COMPLETED'].includes(issue.supportStatus || '');
    const overdue = !!issue.dueDate && !isDone && isDueDatePast(issue.dueDate);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <Link
                    href={issue.product ? `/community/issues/product/${issue.product.id}` : "/community/issues"}
                    className="group inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 font-medium transition-colors duration-300"
                >
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm group-hover:shadow-md group-hover:bg-indigo-50 flex items-center justify-center transition-all duration-300">
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    Back to Issues
                </Link>

                {/* Success Message */}
                {actionSuccess && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-emerald-800 font-medium">{actionSuccess}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <span className="text-rose-800 font-medium">{error}</span>
                    </div>
                )}

                {/* Issue Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                    {/* Header - Modern Gradient */}
                    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 p-8 text-white overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

                        <div className="relative flex justify-between items-start gap-6">
                            <div className="min-w-0 flex-1">
                                <p className="font-mono text-sm font-bold text-indigo-200 mb-1">{formatTicketNumber(issue.ticketNumber)}</p>
                                <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-sm">{issue.title}</h1>
                                {issue.dueDate && (
                                    <div
                                        className={`inline-flex items-center gap-2 px-4 py-2 mb-2 rounded-xl text-base font-extrabold shadow-lg ${overdue ? 'bg-red-600 text-white ring-2 ring-red-300' : 'bg-white text-indigo-700'}`}
                                        suppressHydrationWarning
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Due: {new Date(issue.dueDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', ...DUE_DATE_LOCALE_OPTIONS })}
                                        {overdue && <span className="uppercase tracking-wide">— Overdue</span>}
                                    </div>
                                )}
                                {issue.product && (
                                    <p className="text-indigo-200 text-base flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Product: {issue.product.name}
                                    </p>
                                )}
                                {issue.tags && issue.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {issue.tags.map(tag => (
                                            <span key={tag.id} className={`px-2.5 py-1 text-xs font-bold rounded-full ${tagBadgeClasses(tag.color)}`}>
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3 items-end shrink-0">
                                {/* User Status */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-indigo-200">User Status:</span>
                                    <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full shadow-lg backdrop-blur-sm bg-white/20 border border-white/30 text-white">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {issue.status.replace('_', ' ')}
                                    </span>
                                </div>
                                {/* Support Status */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-indigo-200">Support Status:</span>
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full shadow-lg ${(issue.supportStatus || 'TODO') === 'TODO' ? 'bg-sky-500' :
                                        (issue.supportStatus || 'TODO') === 'IN_PROGRESS' ? 'bg-amber-500' :
                                            (issue.supportStatus || 'TODO') === 'COMPLETE' ? 'bg-violet-500' :
                                                (issue.supportStatus || 'TODO') === 'COMPLETED' ? 'bg-emerald-500' :
                                                    (issue.supportStatus || 'TODO') === 'REJECTED' ? 'bg-rose-500' :
                                                        'bg-gray-500'
                                        } text-white`}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                        {(issue.supportStatus || 'TODO').replace('_', ' ')}
                                    </span>
                                </div>
                                {/* Priority */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-indigo-200">Priority:</span>
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full shadow-lg ${PRIORITY_SOLID[issue.priority || 'MEDIUM'] || 'bg-gray-500'} text-white`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
                                        </svg>
                                        {issue.priority || 'MEDIUM'}
                                    </span>
                                </div>
                                {/* Start Date */}
                                {issue.startDate && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-indigo-200">Start Date:</span>
                                        <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full shadow-lg text-white bg-white/20 border border-white/30 backdrop-blur-sm" suppressHydrationWarning>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            {new Date(issue.startDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', ...DUE_DATE_LOCALE_OPTIONS })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8 space-y-8">
                        {/* Description */}
                        <div>
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                Description
                            </h2>
                            <div
                                className="rich-content bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-2xl text-gray-700 border border-gray-100"
                                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                            />
                        </div>

                        {/* Images */}
                        {issue.images && issue.images.length > 0 && (
                            <div>
                                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Attachments ({issue.images.length})
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {issue.images.map((img, index) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setLightboxIndex(index)}
                                            className="group block aspect-video rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <img
                                                src={img.url}
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons for Owner/Support */}
                        {isOwner && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Support Actions
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {issue.supportStatus === 'TODO' && (
                                        <button
                                            onClick={() => handleAction(() => acceptIssue(issue.id), "Issue accepted! Status changed to In Progress.")}
                                            disabled={isPending}
                                            className="group px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {isPending ? "Processing..." : "Accept Task"}
                                        </button>
                                    )}
                                    {issue.supportStatus === 'IN_PROGRESS' && (
                                        <button
                                            onClick={() => setShowCommentForm('COMPLETE')}
                                            disabled={isPending}
                                            className="group px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {isPending ? "Processing..." : "Mark Complete"}
                                        </button>
                                    )}
                                    {issue.supportStatus === 'REJECTED' && (
                                        <button
                                            onClick={() => setShowCommentForm('RESUBMIT')}
                                            disabled={isPending}
                                            className="group px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Respond & Resubmit
                                        </button>
                                    )}
                                    {(issue.supportStatus === 'COMPLETE' || issue.supportStatus === 'COMPLETED') && (
                                        <span className="px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl font-medium flex items-center gap-2">
                                            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Waiting for user review
                                        </span>
                                    )}

                                    {/* Admin Delete Action */}
                                    {session?.user?.role === 'ADMIN' && (
                                        <div className="ml-auto flex items-center gap-2">
                                            {!showDeleteConfirm ? (
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    disabled={isPending}
                                                    className="px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 font-semibold rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 disabled:opacity-50"
                                                >
                                                    Delete Issue
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 p-3 bg-rose-50 rounded-xl border border-rose-200">
                                                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Confirm delete?</span>
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
                                                        className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition disabled:opacity-50"
                                                    >
                                                        {isPending ? "Deleting..." : "Yes"}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(false)}
                                                        disabled={isPending}
                                                        className="px-4 py-2 bg-white text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition border border-gray-200"
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Priority & Due Date Controls */}
                                <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Priority</label>
                                        <div className="flex flex-wrap gap-2">
                                            {PRIORITY_ORDER.map(p => {
                                                const isActive = (issue.priority || 'MEDIUM') === p;
                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => !isActive && handleAction(() => updateIssuePriority(issue.id, p), `Priority changed to ${p}.`)}
                                                        disabled={isPending || isActive}
                                                        className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 disabled:cursor-not-allowed ${isActive
                                                            ? `${PRIORITY_SOLID[p]} text-white shadow-lg scale-105`
                                                            : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Schedule</label>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-gray-500">Start</span>
                                                <input
                                                    type="date"
                                                    value={startDateInput}
                                                    max={dueDateInput || undefined}
                                                    onChange={(e) => setStartDateInput(e.target.value)}
                                                    disabled={isPending}
                                                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-semibold text-gray-500">Due</span>
                                                <input
                                                    type="date"
                                                    value={dueDateInput}
                                                    min={startDateInput || undefined}
                                                    onChange={(e) => setDueDateInput(e.target.value)}
                                                    disabled={isPending}
                                                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleAction(
                                                    () => setIssueSchedule(issue.id, { startDate: startDateInput || null, dueDate: dueDateInput || null }),
                                                    "Schedule updated."
                                                )}
                                                disabled={isPending || !scheduleChanged || scheduleInvalid}
                                                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                            >
                                                Save
                                            </button>
                                            {(startDateInput || dueDateInput) && (
                                                <button
                                                    onClick={() => { setStartDateInput(""); setDueDateInput(""); }}
                                                    disabled={isPending}
                                                    className="px-4 py-2 bg-white text-gray-500 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                        {scheduleInvalid && (
                                            <p className="mt-1.5 text-xs font-semibold text-rose-500">Start date must be on or before the due date.</p>
                                        )}
                                    </div>
                                    {(allTags.length > 0 || isOwner) && (
                                        <div className="w-full">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tags</label>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {allTags.map(tag => {
                                                    const selected = selectedTagIds.includes(tag.id);
                                                    return (
                                                        <button
                                                            key={tag.id}
                                                            onClick={() => toggleTag(tag.id)}
                                                            disabled={isPending}
                                                            aria-pressed={selected}
                                                            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-150 disabled:opacity-50 ${selected
                                                                ? `${tagBadgeClasses(tag.color)} ring-2 ring-offset-1 ring-indigo-500`
                                                                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {tag.name}
                                                        </button>
                                                    );
                                                })}
                                                {isOwner && !showNewTag && (
                                                    <button
                                                        onClick={() => setShowNewTag(true)}
                                                        disabled={isPending}
                                                        className="px-3 py-1.5 text-xs font-bold rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-all duration-150 disabled:opacity-50"
                                                    >
                                                        + New Tag
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction(() => updateIssueTags(issue.id, selectedTagIds), "Tags updated.")}
                                                    disabled={isPending || !tagsChanged}
                                                    className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                >
                                                    Save Tags
                                                </button>
                                            </div>

                                            {/* Any staff: create a new tag in the shared catalogue */}
                                            {isOwner && showNewTag && (
                                                <div className="mt-3 flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <input
                                                        type="text"
                                                        value={newTagName}
                                                        onChange={(e) => setNewTagName(e.target.value)}
                                                        maxLength={40}
                                                        placeholder="Tag name"
                                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none"
                                                    />
                                                    <div className="flex items-center gap-1.5">
                                                        {TAG_COLOR_OPTIONS.map(color => (
                                                            <button
                                                                key={color}
                                                                type="button"
                                                                onClick={() => setNewTagColor(color)}
                                                                aria-label={color}
                                                                aria-pressed={newTagColor === color}
                                                                className={`w-6 h-6 rounded-full ${tagBadgeClasses(color)} ${newTagColor === color ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={handleCreateTag}
                                                        disabled={creatingTag || !newTagName.trim()}
                                                        className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {creatingTag ? "Creating..." : "Create"}
                                                    </button>
                                                    <button
                                                        onClick={() => { setShowNewTag(false); setNewTagName(""); setNewTagColor("slate"); }}
                                                        disabled={creatingTag}
                                                        className="px-4 py-1.5 bg-white text-gray-600 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
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
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Review Support's Fix
                                </h3>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAction(() => closeIssue(issue.id), "Issue closed! Thank you for your feedback.")}
                                        disabled={isPending}
                                        className="group px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {isPending ? "Processing..." : "Accept & Close"}
                                    </button>
                                    <button
                                        onClick={() => setShowCommentForm('REJECTION')}
                                        disabled={isPending}
                                        className="group px-5 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Reject with Reason
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Comment Form Modal */}
                        {showCommentForm && (
                            <div className="border-t border-gray-100 pt-6 animate-in slide-in-from-top-2 duration-300">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    {showCommentForm === 'REJECTION'
                                        ? 'Reason for Rejection'
                                        : showCommentForm === 'COMPLETE'
                                            ? 'Resolution Notes (Required)'
                                            : 'Response & Fix Details'}
                                </h3>
                                <div className="space-y-4 bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-2xl border border-gray-100">
                                    <textarea
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder={showCommentForm === 'REJECTION'
                                            ? "Please describe what's wrong and what you expected..."
                                            : showCommentForm === 'COMPLETE'
                                                ? "Describe how the issue was resolved, steps taken, and any notes for the user..."
                                                : "Describe what was fixed and any additional notes..."}
                                        className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent min-h-[120px] text-gray-900 placeholder-gray-400 transition-all duration-200"
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
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Attach Images
                                        </button>

                                        {/* Image Preview */}
                                        {commentImages.length > 0 && (
                                            <div className="flex gap-3 mt-3 flex-wrap">
                                                {commentImages.map((file, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img
                                                            src={commentImageUrls[idx]}
                                                            alt={`Preview ${idx + 1}`}
                                                            className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100 group-hover:border-indigo-300 transition-colors"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setCommentImages(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => handleSubmitComment(
                                                showCommentForm,
                                                showCommentForm === 'REJECTION'
                                                    ? () => rejectIssue(issue.id)
                                                    : showCommentForm === 'COMPLETE'
                                                        ? () => completeIssue(issue.id, { message: commentText, imageUrls: [] })
                                                        : () => resubmitIssue(issue.id)
                                            )}
                                            disabled={uploadingComment || !commentText.trim()}
                                            className={`px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${showCommentForm === 'REJECTION'
                                                ? 'bg-gradient-to-r from-rose-500 to-red-500 shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30'
                                                : showCommentForm === 'COMPLETE'
                                                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
                                                    : 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30'
                                                } hover:scale-[1.02]`}
                                        >
                                            {uploadingComment ? (
                                                <>
                                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Submitting...
                                                </>
                                            ) : showCommentForm === 'REJECTION'
                                                ? "Submit Rejection"
                                                : showCommentForm === 'COMPLETE'
                                                    ? "Mark Complete"
                                                    : "Submit & Resubmit"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowCommentForm(null);
                                                setCommentText("");
                                                setCommentImages([]);
                                            }}
                                            className="px-5 py-2.5 bg-white text-gray-600 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message Composer — free-form two-way replies, available at any time */}
                        {(isOwner || isIssueOwner) && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    {isOwner ? 'Reply to Reporter' : 'Reply to Dev Team'}
                                </h3>
                                <div className="space-y-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/40 p-5 rounded-2xl border border-indigo-100">
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="Write a message — ask a question or reply to the other side..."
                                        className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent min-h-[100px] text-gray-900 placeholder-gray-400 transition-all duration-200"
                                    />

                                    {/* Image Upload */}
                                    <div>
                                        <input
                                            ref={messageFileRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                setMessageImages(prev => [...prev, ...files]);
                                            }}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => messageFileRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Attach Images
                                        </button>

                                        {messageImages.length > 0 && (
                                            <div className="flex gap-3 mt-3 flex-wrap">
                                                {messageImages.map((file, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img
                                                            src={messageImageUrls[idx]}
                                                            alt={`Preview ${idx + 1}`}
                                                            className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100 group-hover:border-indigo-300 transition-colors"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setMessageImages(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Send */}
                                    <div className="flex justify-end pt-1">
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={sendingMessage || !messageText.trim()}
                                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {sendingMessage ? (
                                                <>
                                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Comments Thread - Modern Design */}
                        {comments.length > 0 && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                    Conversation History ({comments.length})
                                </h3>
                                <div className="space-y-4">
                                    {comments.map((comment) => {
                                        // Attribute each message by its author's side, not its type,
                                        // so free-form replies from either party render correctly.
                                        const fromReporter = comment.userId === issue.userId;
                                        const senderName = comment.user?.name || comment.user?.email || (fromReporter ? 'Reporter' : 'Dev Team');
                                        const roleLabel = fromReporter ? 'Reporter' : 'Dev Team';
                                        const side = fromReporter
                                            ? { card: 'from-blue-50 to-indigo-50/50 border-blue-100', accent: 'from-blue-400 to-indigo-500', avatar: 'from-blue-400 to-indigo-500', chip: 'bg-blue-100 text-blue-700' }
                                            : { card: 'from-emerald-50 to-green-50/50 border-emerald-100', accent: 'from-emerald-400 to-green-500', avatar: 'from-emerald-400 to-green-500', chip: 'bg-emerald-100 text-emerald-700' };
                                        const typeChip =
                                            comment.type === 'REJECTION' ? { text: 'Rejected', cls: 'bg-rose-100 text-rose-700' } :
                                                comment.type === 'COMPLETE' ? { text: 'Marked complete', cls: 'bg-violet-100 text-violet-700' } :
                                                    comment.type === 'RESUBMIT' ? { text: 'Resubmitted', cls: 'bg-orange-100 text-orange-700' } :
                                                        null;
                                        // Only free-form MESSAGE comments are editable/deletable; workflow
                                        // records (rejection/resubmit/complete) stay immutable for the audit trail.
                                        const isMessage = comment.type === 'MESSAGE';
                                        const canEdit = isMessage && comment.userId === selfUserId;
                                        const canDelete = isMessage && (comment.userId === selfUserId || isAdmin);
                                        const isEditing = editingCommentId === comment.id;
                                        const edited = !!comment.updatedAt
                                            && new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 2000;
                                        return (
                                            <div
                                                key={comment.id}
                                                className={`relative p-5 rounded-2xl transition-all duration-300 hover:shadow-md bg-gradient-to-br border ${side.card}`}
                                            >
                                                {/* Accent Line */}
                                                <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gradient-to-b ${side.accent}`}></div>

                                                <div className="pl-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-3">
                                                            {/* Avatar */}
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${side.avatar}`}>
                                                                {(comment.user?.name || comment.user?.email || '?')[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${side.chip}`}>
                                                                        {roleLabel}
                                                                    </span>
                                                                    {typeChip && (
                                                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${typeChip.cls}`}>
                                                                            {typeChip.text}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 mt-1 font-medium">
                                                                    {senderName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-400 bg-white/50 px-2 py-1 rounded-lg" suppressHydrationWarning>
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
                                                    {isEditing ? (
                                                        <div className="space-y-3">
                                                            <textarea
                                                                value={editingCommentText}
                                                                onChange={(e) => setEditingCommentText(e.target.value)}
                                                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent min-h-[90px] text-gray-900 transition-all duration-200"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={saveEditedComment}
                                                                    disabled={savingComment || !editingCommentText.trim()}
                                                                    className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {savingComment ? "Saving..." : "Save"}
                                                                </button>
                                                                <button
                                                                    onClick={cancelEditingComment}
                                                                    disabled={savingComment}
                                                                    className="px-4 py-1.5 bg-white text-gray-600 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                            {comment.content}
                                                            {edited && <span className="ml-2 text-xs text-gray-400 font-medium">(edited)</span>}
                                                        </p>
                                                    )}

                                                    {/* Comment Images */}
                                                    {!isEditing && comment.images && comment.images.length > 0 && (
                                                        <div className="flex gap-3 mt-4 flex-wrap">
                                                            {comment.images.map((img) => (
                                                                <img
                                                                    key={img.id}
                                                                    src={img.url}
                                                                    alt="Attachment"
                                                                    className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-sm cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
                                                                    onClick={() => window.open(img.url, '_blank')}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Edit / Delete controls */}
                                                    {!isEditing && (canEdit || canDelete) && (
                                                        <div className="flex items-center gap-3 mt-3">
                                                            {canEdit && (
                                                                <button
                                                                    onClick={() => startEditingComment(comment)}
                                                                    className="text-xs font-semibold text-gray-400 hover:text-indigo-600 transition-colors"
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                            {canDelete && confirmDeleteCommentId !== comment.id && (
                                                                <button
                                                                    onClick={() => setConfirmDeleteCommentId(comment.id)}
                                                                    className="text-xs font-semibold text-gray-400 hover:text-rose-600 transition-colors"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                            {canDelete && confirmDeleteCommentId === comment.id && (
                                                                <span className="inline-flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-rose-600">Delete?</span>
                                                                    <button
                                                                        onClick={() => { setConfirmDeleteCommentId(null); removeComment(comment.id); }}
                                                                        disabled={deletingCommentId === comment.id}
                                                                        className="text-xs font-bold text-rose-600 hover:text-rose-700 disabled:opacity-50"
                                                                    >
                                                                        {deletingCommentId === comment.id ? "Deleting..." : "Yes"}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setConfirmDeleteCommentId(null)}
                                                                        disabled={deletingCommentId === comment.id}
                                                                        className="text-xs font-semibold text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                                                    >
                                                                        No
                                                                    </button>
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Activity Log - Modern Timeline */}
                        {issue.activities && issue.activities.length > 0 && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Activity Log
                                </h3>
                                <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-gray-100"></div>

                                    <div className="space-y-4">
                                        {issue.activities.map((activity, index) => (
                                            <div key={activity.id} className="flex gap-4 relative">
                                                {/* Timeline Dot */}
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ${activity.type === 'CREATED' ? 'bg-gradient-to-br from-emerald-400 to-green-500' :
                                                    activity.type === 'STATUS_CHANGE' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                                                        activity.type === 'COMMENTED' ? 'bg-gradient-to-br from-violet-400 to-purple-500' :
                                                            activity.type === 'PRIORITY_CHANGE' ? 'bg-gradient-to-br from-orange-400 to-amber-500' :
                                                                (activity.type === 'DUE_DATE_CHANGE' || activity.type === 'SCHEDULE_CHANGE') ? 'bg-gradient-to-br from-teal-400 to-cyan-500' :
                                                                    activity.type === 'TAG_CHANGE' ? 'bg-gradient-to-br from-pink-400 to-fuchsia-500' :
                                                                        'bg-gradient-to-br from-gray-300 to-gray-400'
                                                    }`}>
                                                    {activity.type === 'CREATED' && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    )}
                                                    {activity.type === 'STATUS_CHANGE' && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                    )}
                                                    {activity.type === 'COMMENTED' && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                        </svg>
                                                    )}
                                                    {activity.type === 'PRIORITY_CHANGE' && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
                                                        </svg>
                                                    )}
                                                    {(activity.type === 'DUE_DATE_CHANGE' || activity.type === 'SCHEDULE_CHANGE') && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                    {activity.type === 'TAG_CHANGE' && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 8V3a2 2 0 012-2z" />
                                                        </svg>
                                                    )}
                                                </div>

                                                <div className={`flex-1 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${index === 0 ? 'ring-2 ring-indigo-100' : ''
                                                    }`}>
                                                    <p className="text-sm text-gray-800">
                                                        <span className="font-semibold text-gray-900">{activity.actorName || activity.user?.name || activity.user?.email || 'System'}</span>
                                                        {' '}<span className="text-gray-600">{activity.description}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1" suppressHydrationWarning>
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
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
                            </div>
                        )}

                        {/* Meta Info */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex flex-wrap justify-between gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-xs">Reported by</span>
                                        <p className="font-medium text-gray-700">{issue.user?.name || issue.user?.email || "Unknown"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 text-xs">Date</span>
                                        <p className="font-medium text-gray-700" suppressHydrationWarning>
                                            {new Date(issue.createdAt).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {issue.startDate && (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-xs">Start Date</span>
                                            <p className="font-medium text-gray-700" suppressHydrationWarning>
                                                {new Date(issue.startDate).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    ...DUE_DATE_LOCALE_OPTIONS
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {issue.dueDate && (
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${overdue ? 'bg-gradient-to-br from-rose-100 to-red-100' : 'bg-gradient-to-br from-indigo-100 to-purple-100'}`}>
                                            <svg className={`w-4 h-4 ${overdue ? 'text-rose-600' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-xs">Due Date</span>
                                            <p className={`font-medium ${overdue ? 'text-rose-600' : 'text-gray-700'}`} suppressHydrationWarning>
                                                {new Date(issue.dueDate).toLocaleDateString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    ...DUE_DATE_LOCALE_OPTIONS
                                                })}{overdue ? ' (overdue)' : ''}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && issue.images && issue.images[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2"
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-6 right-6 text-white/60 hover:text-white transition z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-sm"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="flex h-[94vh] w-[98vw] items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={issue.images[lightboxIndex].url}
                            alt={`Attachment ${lightboxIndex + 1}`}
                            className="h-full w-full object-contain shadow-2xl"
                        />
                    </div>

                    {/* Navigation - Next */}
                    {issue.images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((lightboxIndex + 1) % issue.images.length);
                            }}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                        {lightboxIndex + 1} / {issue.images.length}
                    </div>
                </div>
            )}
        </div>
    );
}
