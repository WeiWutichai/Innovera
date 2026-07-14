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
