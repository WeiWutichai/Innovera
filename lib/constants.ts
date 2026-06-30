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

// Issue comment types.
export const ISSUE_COMMENT_TYPES = ["REJECTION", "RESUBMIT", "COMPLETE"] as const;
export type IssueCommentType = (typeof ISSUE_COMMENT_TYPES)[number];
