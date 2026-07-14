// Centralized constants shared across the app.

// bcrypt work factor. Raising this only affects NEWLY created hashes;
// bcrypt.compare reads the cost from each stored hash, so existing
// (cost-10) hashes keep working.
export const BCRYPT_ROUNDS = 12;

// Issue lifecycle (user-facing) statuses.
export const ISSUE_STATUS = {
    OPEN: "OPEN",
    PENDING_REVIEW: "PENDING_REVIEW",
    CLOSED: "CLOSED",
    REJECTED: "REJECTED",
} as const;
export type IssueStatus = (typeof ISSUE_STATUS)[keyof typeof ISSUE_STATUS];
export const ISSUE_STATUS_VALUES = Object.values(ISSUE_STATUS) as string[];

// Support-side statuses. NOTE: both COMPLETE and COMPLETED exist for
// historical reasons; treat them as equivalent terminal "done" states.
export const SUPPORT_STATUS = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETE: "COMPLETE",
    COMPLETED: "COMPLETED",
    REJECTED: "REJECTED",
} as const;
export type SupportStatus = (typeof SUPPORT_STATUS)[keyof typeof SUPPORT_STATUS];
export const SUPPORT_STATUS_VALUES = Object.values(SUPPORT_STATUS) as string[];

// Issue priorities. Chosen by the reporter at creation; support/admin can
// adjust afterwards.
export const ISSUE_PRIORITY = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    URGENT: "URGENT",
} as const;
export type IssuePriority = (typeof ISSUE_PRIORITY)[keyof typeof ISSUE_PRIORITY];
export const ISSUE_PRIORITY_VALUES = Object.values(ISSUE_PRIORITY) as string[];

// Human-readable ticket id shown everywhere an issue is referenced.
// ticketNumber is DB-generated (autoincrement); this is display-only.
export function formatTicketNumber(ticketNumber: number): string {
    return `ISS-${String(ticketNumber).padStart(4, "0")}`;
}

// Due dates are date-only values stored as UTC midnight. Always render them
// with timeZone: "UTC" so every viewer sees the exact date support picked,
// and compare against the end of the due day in UTC so the overdue flip
// happens at one deterministic instant regardless of server/client timezone
// (this also keeps SSR HTML and client hydration in agreement).
export const DUE_DATE_LOCALE_OPTIONS = { timeZone: "UTC" } as const;

export function isDueDatePast(dueDate: Date | string): boolean {
    return Date.now() > new Date(dueDate).getTime() + 86_399_999;
}

// Issue comment types. MESSAGE is a free-form reply either party can post at
// any time (two-way Q&A), independent of a status transition; the others are
// tied to specific workflow actions.
export const ISSUE_COMMENT_TYPES = ["REJECTION", "RESUBMIT", "COMPLETE", "MESSAGE"] as const;
export type IssueCommentType = (typeof ISSUE_COMMENT_TYPES)[number];

// Tag badge palette. Keys are stored in Tag.color; classes must be full static
// strings (Tailwind can't see dynamically-built class names at build time).
export const TAG_COLORS: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 border border-slate-200",
    red: "bg-red-100 text-red-700 border border-red-200",
    orange: "bg-orange-100 text-orange-700 border border-orange-200",
    amber: "bg-amber-100 text-amber-800 border border-amber-200",
    lime: "bg-lime-100 text-lime-700 border border-lime-200",
    green: "bg-green-100 text-green-700 border border-green-200",
    teal: "bg-teal-100 text-teal-700 border border-teal-200",
    cyan: "bg-cyan-100 text-cyan-700 border border-cyan-200",
    sky: "bg-sky-100 text-sky-700 border border-sky-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    indigo: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    violet: "bg-violet-100 text-violet-700 border border-violet-200",
    fuchsia: "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200",
    pink: "bg-pink-100 text-pink-700 border border-pink-200",
    rose: "bg-rose-100 text-rose-700 border border-rose-200",
};
export const TAG_COLOR_KEYS = Object.keys(TAG_COLORS) as [string, ...string[]];

// Badge classes for a tag color, falling back to the neutral slate palette.
export function tagBadgeClasses(color: string | null | undefined): string {
    return TAG_COLORS[color || "slate"] || TAG_COLORS.slate;
}
