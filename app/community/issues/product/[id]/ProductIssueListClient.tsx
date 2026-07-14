"use client";

import { useState, useEffect } from "react";
import IssueFormModal from "../../IssueFormModal";
import { useRouter } from "next/navigation";
import { formatTicketNumber, isDueDatePast, DUE_DATE_LOCALE_OPTIONS, tagBadgeClasses } from "@/lib/constants";


interface Product {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface Issue {
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
    createdAt: Date;
}

interface CurrentUser {
    role?: string | null;
}

const STATUS_TABS = [
    { key: 'ALL', label: 'All' },
    { key: 'OPEN', label: 'Open' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'PENDING_REVIEW', label: 'Pending Review' },
    { key: 'CLOSED', label: 'Closed' },
    { key: 'REJECTED', label: 'Rejected' },
];

function htmlToText(html: string) {
    if (typeof document === 'undefined') {
        return html.replace(/<[^>]*>/g, '');
    }

    const element = document.createElement('div');
    element.innerHTML = html;
    return element.textContent || '';
}

// Overdue = past the end of the due day (UTC) while the issue still needs
// support work. REJECTED is deliberately NOT terminal: a reporter rejecting
// the fix puts the issue back into active rework, where the overdue flag
// matters most. COMPLETE/COMPLETED mean the ball is in the reporter's court.
function isOverdue(issue: Issue): boolean {
    if (!issue.dueDate) return false;
    const done = issue.status === 'CLOSED'
        || ['COMPLETE', 'COMPLETED'].includes(issue.supportStatus || '');
    if (done) return false;
    return isDueDatePast(issue.dueDate);
}

export default function ProductIssueListClient({ product, issues, user }: { product: Product, issues: Issue[], user: CurrentUser | null }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

    // Distinct tags present across the current issue set, for the filter row.
    const availableTags = Array.from(
        new Map(issues.flatMap(i => i.tags || []).map(t => [t.id, t])).values()
    ).sort((a, b) => a.name.localeCompare(b.name));

    function toggleTagFilter(tagId: string) {
        setSelectedTagIds(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    }

    // Auto-refresh logic: refresh data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [router]);

    const isOwnerOrAdmin = user?.role === 'ADMIN' || user?.role === 'OWNER';

    // Filter issues based on active tab, tag filter, and search query.
    const filteredIssues = issues.filter(issue => {
        const matchesTab = activeTab === 'ALL' || issue.status === activeTab || issue.supportStatus === activeTab;
        // Tag filter is OR across selected tags: show issues carrying any of them.
        const matchesTags = selectedTagIds.length === 0
            || (issue.tags || []).some(t => selectedTagIds.includes(t.id));
        const descriptionText = htmlToText(issue.description);
        const query = searchQuery.toLowerCase();
        // Match on the ticket number only when the query looks like a ticket
        // reference ("ISS-0042", "iss42", "42") — otherwise short queries like
        // "iss" or "0" would match every card via the constant prefix/padding.
        const ticketQuery = query.match(/^(?:iss-?)?(\d+)$/);
        const matchesTicket = !!ticketQuery
            && String(issue.ticketNumber).padStart(4, '0').includes(ticketQuery[1]);
        const matchesSearch = searchQuery === '' ||
            issue.title.toLowerCase().includes(query) ||
            descriptionText.toLowerCase().includes(query) ||
            (issue.tags || []).some(t => t.name.toLowerCase().includes(query)) ||
            matchesTicket;
        return matchesTab && matchesTags && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <section>
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                        <span className={`w-1.5 h-8 ${isOwnerOrAdmin ? 'bg-gradient-to-b from-indigo-500 to-purple-600' : 'bg-gradient-to-b from-rose-500 to-pink-600'} rounded-full`}></span>
                        {isOwnerOrAdmin ? 'All Product Issues' : 'My Submitted Issues'}
                        <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {filteredIssues.length} {activeTab === 'ALL' ? 'total' : ''}
                        </span>
                    </h2>
                    {!isOwnerOrAdmin && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative bg-gradient-to-r from-rose-500 to-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Create New Issue
                        </button>
                    )}
                </div>

                {/* Search Box - Glassmorphism Style */}
                <div className="relative mb-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search issues by title, description, tag, or ticket..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-900 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Status Filter Tabs - Modern Pills */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {STATUS_TABS.map(tab => {
                        const count = tab.key === 'ALL'
                            ? issues.length
                            : issues.filter(i => i.status === tab.key || i.supportStatus === tab.key).length;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                                    : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md border border-gray-200/50'
                                    }`}
                            >
                                {tab.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Tag Filter Row */}
                {availableTags.length > 0 && (
                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Tags</span>
                        {availableTags.map(tag => {
                            const active = selectedTagIds.includes(tag.id);
                            return (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleTagFilter(tag.id)}
                                    aria-pressed={active}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-150 ${active
                                        ? `${tagBadgeClasses(tag.color)} ring-2 ring-offset-1 ring-indigo-500`
                                        : 'bg-white/80 text-gray-500 border border-gray-200/50 hover:bg-white hover:shadow-sm'
                                        }`}
                                >
                                    {tag.name}
                                </button>
                            );
                        })}
                        {selectedTagIds.length > 0 && (
                            <button
                                onClick={() => setSelectedTagIds([])}
                                className="px-3 py-1.5 text-xs font-semibold rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                )}

                {/* Issue Cards - Glassmorphism Style */}
                <div className="space-y-4">
                    {filteredIssues.map((issue) => (
                        <a
                            key={issue.id}
                            href={`/community/issues/view/${issue.id}`}
                            className="group block relative overflow-hidden"
                        >
                            {/* Card Background Effects */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                            {/* Main Card */}
                            <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/60 p-5 rounded-2xl shadow-sm group-hover:shadow-xl group-hover:border-indigo-300/50 group-hover:scale-[1.01] transition-all duration-300">
                                {/* Accent Line */}
                                <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full transition-all duration-300 ${issue.status === 'CLOSED' ? 'bg-gradient-to-b from-emerald-400 to-green-500' :
                                    issue.status === 'OPEN' ? 'bg-gradient-to-b from-blue-400 to-indigo-500' :
                                        issue.status === 'PENDING_REVIEW' ? 'bg-gradient-to-b from-purple-400 to-violet-500' :
                                            issue.status === 'REJECTED' ? 'bg-gradient-to-b from-rose-400 to-red-500' :
                                                'bg-gradient-to-b from-gray-300 to-gray-400'
                                    }`}></div>

                                {/* Header with title and statuses */}
                                <div className="flex items-start justify-between gap-4 mb-3 pl-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-700 transition-colors duration-300 truncate">
                                            <span className="font-mono text-sm font-bold text-indigo-500 mr-2">{formatTicketNumber(issue.ticketNumber)}</span>
                                            {issue.title}
                                        </h3>
                                        {/* Description */}
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{htmlToText(issue.description)}</p>
                                        {/* Tags */}
                                        {issue.tags && issue.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {issue.tags.map(tag => (
                                                    <span key={tag.id} className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${tagBadgeClasses(tag.color)}`}>
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        {/* Priority Badge */}
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full shadow-sm transition-all duration-300 group-hover:scale-105 ${(issue.priority || 'MEDIUM') === 'URGENT' ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-500/25' :
                                            (issue.priority || 'MEDIUM') === 'HIGH' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/25' :
                                                (issue.priority || 'MEDIUM') === 'LOW' ? 'bg-gradient-to-r from-slate-400 to-gray-400 text-white shadow-gray-400/25' :
                                                    'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-teal-500/25'
                                            }`}>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" />
                                            </svg>
                                            {issue.priority || 'MEDIUM'}
                                        </span>

                                        {/* User Status Badge */}
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full shadow-sm transition-all duration-300 group-hover:scale-105 ${issue.status === 'OPEN' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/25' :
                                            issue.status === 'PENDING_REVIEW' ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-purple-500/25' :
                                                issue.status === 'CLOSED' ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/25' :
                                                    issue.status === 'REJECTED' ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/25' :
                                                        'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                            }`}>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {issue.status.replace('_', ' ')}
                                        </span>

                                        {/* Support Status Badge */}
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full shadow-sm transition-all duration-300 group-hover:scale-105 ${(issue.supportStatus || 'TODO') === 'TODO' ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-sky-500/25' :
                                            (issue.supportStatus || 'TODO') === 'IN_PROGRESS' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-amber-500/25' :
                                                (issue.supportStatus || 'TODO') === 'COMPLETE' ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-violet-500/25' :
                                                    (issue.supportStatus || 'TODO') === 'COMPLETED' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/25' :
                                                        (issue.supportStatus || 'TODO') === 'REJECTED' ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/25' :
                                                            'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                                            }`}>
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                            SUPPORT: {(issue.supportStatus || 'TODO').replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center gap-2 text-xs text-gray-400 pl-4" suppressHydrationWarning>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Reported on {new Date(issue.createdAt).toLocaleDateString()}

                                    {issue.startDate && (
                                        <span className="inline-flex items-center gap-1" suppressHydrationWarning>
                                            <span className="text-gray-300">·</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Start {new Date(issue.startDate).toLocaleDateString(undefined, DUE_DATE_LOCALE_OPTIONS)}
                                        </span>
                                    )}

                                    {issue.dueDate && (
                                        <span className={`inline-flex items-center gap-1 ${isOverdue(issue) ? 'text-rose-500 font-semibold' : ''}`} suppressHydrationWarning>
                                            <span className="text-gray-300">·</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Due {new Date(issue.dueDate).toLocaleDateString(undefined, DUE_DATE_LOCALE_OPTIONS)}{isOverdue(issue) ? ' (overdue)' : ''}
                                        </span>
                                    )}

                                    {/* Arrow indicator on hover */}
                                    <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    ))}

                    {issues.length === 0 && (
                        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50 backdrop-blur-sm">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500 font-medium">No issues reported yet.</p>
                            <p className="text-gray-400 text-sm mt-1">Create your first issue to get started.</p>
                        </div>
                    )}
                </div>
            </section>

            {isModalOpen && (
                <IssueFormModal
                    product={product}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
