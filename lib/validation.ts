import { z } from "zod";
import { ISSUE_COMMENT_TYPES, ISSUE_PRIORITY } from "./constants";

// Demo Request Validation Schema
export const demoRequestSchema = z.object({
    workEmail: z.string().email("Invalid email format"),
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    phoneNumber: z.string().optional(),
    companyName: z.string().min(1, "Company name is required").max(200),
    country: z.string().optional(),
    interest: z.string().optional(),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;

// Shared password rule (used by registration and password changes).
export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long");

// User Registration Validation Schema
export const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: passwordSchema,
    name: z.string().min(1, "Name is required").max(100).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Chat message validation (public chat endpoint).
export const chatMessageSchema = z.object({
    sessionId: z.string().min(1).max(100),
    message: z.string().min(1, "Message is required").max(1000, "Message too long (max 1000 characters)"),
    userId: z.union([z.string(), z.number()]).optional(),
    guestId: z.string().max(100).optional().nullable(),
    requestHumanSupport: z.boolean().optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

// Issue creation validation.
export const issueCreateSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required").max(10000),
    productId: z.string().max(100).optional(),
    imageUrls: z.array(z.string().max(500)).max(20).optional(),
    priority: z.enum(ISSUE_PRIORITY).optional(),
});

export type IssueCreateInput = z.infer<typeof issueCreateSchema>;

// Issue schedule date validation (start date / due date). Arrives from
// <input type="date"> as "YYYY-MM-DD"; empty string or null clears the date.
// Only the picker's exact format is accepted (z.iso.date also bounds the year
// to 4 digits); the string parses as UTC midnight, which is the canonical
// form for these date-only values.
export const issueDateSchema = z
    .union([z.null(), z.literal(""), z.iso.date()])
    .transform((v) => (v ? new Date(v) : null));

// Issue comment validation.
export const issueCommentSchema = z.object({
    issueId: z.string().min(1).max(100),
    content: z.string().min(1, "Comment is required").max(10000),
    type: z.enum(ISSUE_COMMENT_TYPES),
    imageUrls: z.array(z.string().max(500)).max(20).optional(),
});

export type IssueCommentInput = z.infer<typeof issueCommentSchema>;

// Profile update validation (password optional; if present must meet policy).
export const profileUpdateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    image: z.string().max(500).optional().nullable(),
    password: passwordSchema.optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
