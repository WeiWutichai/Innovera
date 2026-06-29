import { auth } from "@/auth";
import { Role } from "@prisma/client";

export type SessionUser = {
    id: string;
    role: Role;
    isApproved: boolean;
    canReportIssues: boolean;
    name?: string | null;
    email?: string | null;
};

/**
 * Thrown by the require* helpers. Carries an HTTP status so route handlers can
 * translate it into a response and server actions can surface a clean message.
 */
export class AuthError extends Error {
    status: number;
    constructor(message: string, status = 401) {
        super(message);
        this.name = "AuthError";
        this.status = status;
    }
}

/** ADMIN and OWNER are both considered staff (back-office) roles. */
export function isStaff(role?: Role | string | null): boolean {
    return role === "ADMIN" || role === "OWNER";
}

/** Returns the authenticated session user, or throws AuthError(401). */
export async function requireUser(): Promise<SessionUser> {
    const session = await auth();
    if (!session?.user?.id) {
        throw new AuthError("Unauthorized", 401);
    }
    return session.user as SessionUser;
}

/** Returns the authenticated staff (ADMIN/OWNER) user, or throws. */
export async function requireStaff(): Promise<SessionUser> {
    const user = await requireUser();
    if (!isStaff(user.role)) {
        throw new AuthError("Forbidden", 403);
    }
    return user;
}

/** Returns the authenticated ADMIN user, or throws. */
export async function requireAdmin(): Promise<SessionUser> {
    const user = await requireUser();
    if (user.role !== "ADMIN") {
        throw new AuthError("Forbidden", 403);
    }
    return user;
}

/** The DB user id (number) for a session user. */
export function sessionUserId(user: { id: string }): number {
    return parseInt(user.id, 10);
}

/**
 * Helper for API route handlers: maps an AuthError to a JSON Response, or
 * rethrows anything else. Usage:
 *   try { const u = await requireStaff(); ... }
 *   catch (e) { const r = authErrorResponse(e); if (r) return r; throw e; }
 */
export function authErrorResponse(error: unknown): Response | null {
    if (error instanceof AuthError) {
        return Response.json({ success: false, error: error.message }, { status: error.status });
    }
    return null;
}
