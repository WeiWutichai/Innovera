"use client";

import { useState, useEffect } from "react";
import IssueFormModal from "../../IssueFormModal";
import { useRouter } from "next/navigation";


interface Product {
    id: string;
    name: string;
}

interface Issue {
    id: string;
    title: string;
    description: string;
    status: string;
    supportStatus: string;
    createdAt: Date;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'OPEN': case 'TODO': return 'bg-blue-100 text-blue-800';
        case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
        case 'PENDING_REVIEW': case 'COMPLETE': return 'bg-purple-100 text-purple-800';
        case 'CLOSED': case 'COMPLETED': return 'bg-green-100 text-green-800';
        case 'REJECTED': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const STATUS_TABS = [
    { key: 'ALL', label: 'All' },
    { key: 'OPEN', label: 'Open' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'PENDING_REVIEW', label: 'Pending Review' },
    { key: 'CLOSED', label: 'Closed' },
    { key: 'REJECTED', label: 'Rejected' },
];

export default function ProductIssueListClient({ product, issues, user }: { product: Product, issues: any[], user: any }) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Auto-refresh logic: refresh data every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [router]);

    const isOwnerOrAdmin = user?.role === 'ADMIN' || user?.role === 'OWNER';

    // Filter issues based on active tab and search query
    const filteredIssues = issues.filter(issue => {
        const matchesTab = activeTab === 'ALL' || issue.status === activeTab || issue.supportStatus === activeTab;
        const matchesSearch = searchQuery === '' ||
            issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                        <span className={`w-1.5 h-6 ${isOwnerOrAdmin ? 'bg-blue-600' : 'bg-red-600'} rounded-full`}></span>
                        {isOwnerOrAdmin ? 'All Product Issues' : 'My Submitted Issues'}
                        <span className="text-sm font-normal text-gray-500">({filteredIssues.length} {activeTab === 'ALL' ? 'total' : ''})</span>
                    </h2>
                    {!isOwnerOrAdmin && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Create a new issue
                        </button>
                    )}
                </div>

                {/* Search Box */}
                <div className="relative mb-4">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search issues by title or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B286D] focus:border-transparent text-gray-900"
                    />
                </div>

                {/* Status Filter Tabs */}
                <div className="flex gap-2 mb-4 flex-wrap">
                    {STATUS_TABS.map(tab => {
                        const count = tab.key === 'ALL'
                            ? issues.length
                            : issues.filter(i => i.status === tab.key || i.supportStatus === tab.key).length;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab.key
                                    ? 'bg-[#4B286D] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label} ({count})
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-3">
                    {filteredIssues.map((issue) => (
                        <a
                            key={issue.id}
                            href={`/community/issues/view/${issue.id}`}
                            className="block border border-gray-200 p-4 rounded-xl bg-white shadow-sm hover:shadow-lg hover:border-[#4B286D] transition cursor-pointer"
                        >
                            {/* Header with title and statuses */}
                            <div className="flex items-start justify-between gap-3 mb-1">
                                <h3 className="font-bold text-lg text-gray-900">{issue.title}</h3>
                                <div className="flex gap-3 shrink-0">
                                    {/* User Status Badge */}
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full border-2 ${issue.status === 'OPEN' ? 'bg-green-500 border-green-600 text-white' :
                                        issue.status === 'PENDING_REVIEW' ? 'bg-purple-500 border-purple-600 text-white' :
                                            issue.status === 'CLOSED' ? 'bg-gray-500 border-gray-600 text-white' :
                                                issue.status === 'REJECTED' ? 'bg-red-500 border-red-600 text-white' :
                                                    'bg-blue-500 border-blue-600 text-white'
                                        }`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {issue.status.replace('_', ' ')}
                                    </span>
                                    {/* Support Status Badge */}
                                    <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full ${(issue.supportStatus || 'TODO') === 'TODO' ? 'bg-blue-500 text-white' :
                                        (issue.supportStatus || 'TODO') === 'IN_PROGRESS' ? 'bg-yellow-500 text-white' :
                                            (issue.supportStatus || 'TODO') === 'COMPLETE' ? 'bg-purple-500 text-white' :
                                                (issue.supportStatus || 'TODO') === 'COMPLETED' ? 'bg-green-500 text-white' :
                                                    (issue.supportStatus || 'TODO') === 'REJECTED' ? 'bg-red-500 text-white' :
                                                        'bg-gray-500 text-white'
                                        }`}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                        SUPPORT: {(issue.supportStatus || 'TODO').replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            {/* Description */}
                            <p className="text-gray-500 text-sm mb-1 line-clamp-1">{issue.description}</p>
                            {/* Footer */}
                            <div className="text-xs text-gray-400" suppressHydrationWarning>
                                Reported on {new Date(issue.createdAt).toLocaleDateString()}
                            </div>
                        </a>
                    ))}

                    {issues.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded text-gray-500 bg-white">
                            No issues reported yet.
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
