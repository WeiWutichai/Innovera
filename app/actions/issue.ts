'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createNotification, markIssueNotificationsAsRead } from "./notification";
import { sendLineMulticastMessage, createIssueNotification } from "@/lib/line-messaging";
import { requireUser, requireStaff, requireAdmin, isStaff, sessionUserId } from "@/lib/auth-helpers";
import { ISSUE_STATUS_VALUES } from "@/lib/constants";
import { issueCommentSchema, issueCreateSchema } from "@/lib/validation";

// Helper to send LINE notifications to product-assigned LINE users
async function sendLineNotificationForIssue(
    eventType: 'create' | 'accept' | 'complete' | 'reject' | 'close' | 'comment',
    issue: { id: string; title: string; productId?: string | null },
    actorName?: string
) {
    if (!issue.productId) return;

    try {
        // Get LINE users assigned to this product
        const lineUsers = await prisma.lineUser.findMany({
            where: {
                products: {
                    some: { id: issue.productId }
                }
            },
            select: { lineUserId: true }
        });

        if (lineUsers.length === 0) return;

        // Get product name
        const product = await prisma.product.findUnique({
            where: { id: issue.productId },
            select: { name: true }
        });

        // Create notification message
        const baseUrl = process.env.NEXTAUTH_URL || 'https://your-domain.com';
        const message = createIssueNotification(eventType, {
            id: issue.id,
            title: issue.title,
            productName: product?.name,
            actorName,
        }, baseUrl);

        // Send to all LINE users
        const userIds = lineUsers.map(u => u.lineUserId);
        await sendLineMulticastMessage(userIds, [message]);

        console.log(`[LINE] Sent ${eventType} notification to ${userIds.length} users for issue ${issue.id}`);
    } catch (error) {
        console.error('[LINE] Error sending notification:', error);
        // Don't throw - LINE notification failure shouldn't break the main action
    }
}

// Builds the data payload for an IssueActivity row. Used both standalone
// (prisma.issueActivity.create) and inside transactions (tx.issueActivity.create)
// so the audit log can be written atomically with the status mutation it records.
function buildActivity(data: {
    issueId: string;
    userId?: number;
    actorName?: string;
    type: string;
    description: string;
}) {
    return {
        issueId: data.issueId,
        userId: data.userId,
        actorName: data.actorName,
        type: data.type,
        description: data.description,
    };
}

// Standalone activity log (non-transactional call sites).
async function logActivity(data: {
    issueId: string;
    userId?: number;
    actorName?: string;
    type: string;
    description: string;
}) {
    return await prisma.issueActivity.create({ data: buildActivity(data) });
}

// Display name used in activity descriptions.
function actorLabel(user: { name?: string | null; email?: string | null }): string {
    return user.name || user.email || 'Unknown';
}

// True if the product with `productId` has an owner (UserProducts M2M) matching `userId`.
async function ownsProduct(userId: number, productId: string | null): Promise<boolean> {
    if (!productId) return false;
    const product = await prisma.product.findFirst({
        where: { id: productId, owners: { some: { id: userId } } },
        select: { id: true },
    });
    return !!product;
}

export async function getIssues(productId?: string) {
    const user = await requireUser();
    const self = sessionUserId(user);

    // Scope the query by role at the database layer (no in-memory filtering):
    // - ADMIN: every issue
    // - OWNER: only issues for products they own
    // - regular user: only their own issues
    const where: any = {};
    if (productId) {
        where.productId = productId;
    }
    if (user.role === 'ADMIN') {
        // No extra constraint - admins see everything.
    } else if (user.role === 'OWNER') {
        where.product = { owners: { some: { id: self } } };
    } else {
        where.userId = self;
    }

    return await prisma.issue.findMany({
        where,
        include: {
            user: { select: { name: true, email: true } },
            product: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
    });
}


export async function createIssue(data: { title: string; description: string; productId?: string; imageUrls?: string[] }) {
    const user = await requireUser();

    if (!user.canReportIssues && user.role !== 'ADMIN') {
        throw new Error("Permission denied. You need approval to report issues.");
    }

    // Validate untrusted input (length limits, array bounds, etc.).
    const parsed = issueCreateSchema.parse(data);
    const selfId = sessionUserId(user);

    try {
        // 1. Create Issue without images first (to check if basic create works)
        const newIssue = await prisma.issue.create({
            data: {
                title: parsed.title,
                description: parsed.description,
                userId: selfId,
                productId: parsed.productId,
            }
        });

        // 2. Create Images if any
        if (parsed.imageUrls && parsed.imageUrls.length > 0) {
            await prisma.issueImage.createMany({
                data: parsed.imageUrls.map(url => ({
                    url,
                    issueId: newIssue.id
                }))
            });
        }

        // 3. Log Activity
        await logActivity({
            issueId: newIssue.id,
            userId: selfId,
            actorName: actorLabel(user),
            type: 'CREATED',
            description: `Issue created: ${newIssue.title}`
        });

        // Notify product owners and admins
        if (parsed.productId) {
            const product = await prisma.product.findUnique({
                where: { id: parsed.productId },
                include: { owners: true }
            });

            const admins = await prisma.user.findMany({
                where: { role: 'ADMIN' },
                select: { id: true },
            });

            // De-dupe owners + admins, excluding the creator.
            const notifyIds = new Set<number>();
            product?.owners?.forEach(owner => notifyIds.add(owner.id));
            admins.forEach(admin => notifyIds.add(admin.id));
            notifyIds.delete(selfId);

            // Batch the notifications in a single insert (was an N+1 loop of
            // createNotification). createNotification only adds a redundant
            // session check + per-row error swallow, so a guarded createMany is
            // equivalent and keeps notification failures from breaking creation.
            if (notifyIds.size > 0) {
                try {
                    await prisma.notification.createMany({
                        data: Array.from(notifyIds).map(uid => ({
                            userId: uid,
                            productId: parsed.productId,
                            issueId: newIssue.id,
                            type: "ISSUE_CREATED",
                            title: "New Issue Reported",
                            message: `New issue "${parsed.title}" reported for ${product?.name || 'Product'}`,
                            link: `/community/issues/view/${newIssue.id}`,
                            isRead: false,
                        })),
                    });
                } catch (err) {
                    console.error("Failed to create issue notifications:", err);
                }
            }
        }

        revalidatePath("/community/issues");
        if (parsed.productId) {
            revalidatePath(`/community/issues/product/${parsed.productId}`);
        }

        // Send LINE notification
        await sendLineNotificationForIssue('create', {
            id: newIssue.id,
            title: newIssue.title,
            productId: parsed.productId,
        }, user.name || user.email || undefined);

        return newIssue;
    } catch (error: any) {
        console.error("Error creating issue:", error);
        throw new Error(error?.message || "Failed to create issue. Please try again later.");
    }
}

export async function updateIssueStatus(id: string, status: string) {
    const user = await requireAdmin();

    // Validate the status against the allowed user-facing values.
    if (!ISSUE_STATUS_VALUES.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
    }

    // Atomic: status mutation + activity log share one transaction so the
    // audit trail cannot diverge from the issue state.
    const [issue] = await prisma.$transaction([
        prisma.issue.update({
            where: { id },
            data: { status },
        }),
        prisma.issueActivity.create({
            data: buildActivity({
                issueId: id,
                userId: sessionUserId(user),
                actorName: actorLabel(user),
                type: 'STATUS_CHANGE',
                description: `Issue status updated to ${status}`,
            }),
        }),
    ]);

    revalidatePath('/community/issues');
    return issue;
}

export async function getIssueById(id: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const issue = await prisma.issue.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, email: true } },
            ...({
                activities: {
                    include: { user: { select: { name: true, email: true } } },
                    orderBy: { createdAt: 'desc' }
                }
            } as any)
        }
    });

    if (!issue) {
        throw new Error("Issue not found");
    }

    // Authorization: ADMIN sees any issue; OWNER only issues for products they
    // own (or that they reported); regular users only their own.
    const role = session.user.role;
    const selfId = parseInt(session.user.id);
    if (role === 'ADMIN') {
        // admins can view any issue
    } else if (role === 'OWNER') {
        const owns = issue.productId ? await ownsProduct(selfId, issue.productId) : false;
        if (!owns && issue.userId !== selfId) {
            throw new Error("Unauthorized");
        }
    } else if (issue.userId !== selfId) {
        throw new Error("Unauthorized");
    }

    const images = await prisma.issueImage.findMany({
        where: { issueId: id },
        select: { id: true, url: true }
    });

    let product = null;
    if (issue.productId) {
        product = await prisma.product.findUnique({
            where: { id: issue.productId },
            select: { id: true, name: true }
        });
    }

    return {
        ...issue,
        images,
        product,
        activities: (issue as any).activities || []
    };
}

export async function acceptIssue(id: string) {
    const user = await requireStaff();

    const existingIssue = await prisma.issue.findUnique({
        where: { id },
        select: { id: true, title: true, productId: true, userId: true },
    });
    if (!existingIssue) throw new Error("Issue not found");

    // OWNER is scoped to products they own; ADMIN is global.
    if (user.role !== 'ADMIN' && !(await ownsProduct(sessionUserId(user), existingIssue.productId))) {
        throw new Error("Unauthorized");
    }

    // Atomic: status mutation + activity log.
    const [issue] = await prisma.$transaction([
        prisma.issue.update({
            where: { id },
            data: { supportStatus: 'IN_PROGRESS' },
        }),
        prisma.issueActivity.create({
            data: buildActivity({
                issueId: id,
                userId: sessionUserId(user),
                actorName: actorLabel(user),
                type: 'STATUS_CHANGE',
                description: `Issue accepted by support. Support status: IN_PROGRESS`,
            }),
        }),
    ]);

    // --- side effects (kept outside the transaction) ---

    // Clear previous notifications (e.g. New Issue Reported) for the owner
    await markIssueNotificationsAsRead(id);

    await createNotification({
        userId: existingIssue.userId,
        productId: existingIssue.productId || undefined,
        issueId: id,
        type: "ISSUE_STATUS_UPDATE",
        title: "Issue Accepted",
        message: `Your issue "${existingIssue.title}" has been accepted and is now In Progress.`,
        link: `/community/issues/view/${id}`
    });

    revalidatePath('/community/issues');

    // Send LINE notification for accept
    await sendLineNotificationForIssue('accept', {
        id: existingIssue.id,
        title: existingIssue.title,
        productId: existingIssue.productId,
    }, user.name || user.email || undefined);

    return issue;
}

export async function completeIssue(id: string, data?: { message?: string; imageUrls?: string[] }) {
    const user = await requireStaff();

    const existingIssue = await prisma.issue.findUnique({
        where: { id },
        select: { id: true, title: true, productId: true, userId: true },
    });
    if (!existingIssue) throw new Error("Issue not found");

    // OWNER is scoped to products they own; ADMIN is global.
    if (user.role !== 'ADMIN' && !(await ownsProduct(sessionUserId(user), existingIssue.productId))) {
        throw new Error("Unauthorized");
    }

    // Atomic: status mutation + optional resolution comment (+ images) + activity
    // log share one interactive transaction (the comment images depend on the
    // generated comment id, so an array transaction is not sufficient here).
    const issue = await prisma.$transaction(async (tx) => {
        const updated = await tx.issue.update({
            where: { id },
            data: {
                supportStatus: 'COMPLETE',
                status: 'PENDING_REVIEW',
            },
        });

        // Save resolution comment if message provided
        if (data?.message) {
            const comment = await tx.issueComment.create({
                data: {
                    content: data.message,
                    type: 'COMPLETE',
                    issueId: id,
                    userId: sessionUserId(user),
                },
            });

            if (data.imageUrls && data.imageUrls.length > 0) {
                await tx.issueCommentImage.createMany({
                    data: data.imageUrls.map(url => ({ url, commentId: comment.id })),
                });
            }
        }

        await tx.issueActivity.create({
            data: buildActivity({
                issueId: id,
                userId: sessionUserId(user),
                actorName: actorLabel(user),
                type: 'STATUS_CHANGE',
                description: `Issue marked as complete by support.${data?.message ? ` Note: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}` : ''}`,
            }),
        });

        return updated;
    });

    // --- side effects (kept outside the transaction) ---

    // Clear previous notifications (e.g. New Issue for owner)
    await markIssueNotificationsAsRead(id);

    await createNotification({
        userId: existingIssue.userId,
        productId: existingIssue.productId || undefined,
        issueId: id,
        type: "ISSUE_COMPLETE",
        title: "Issue Completed",
        message: `Support has marked your issue "${existingIssue.title}" as Complete. Please review the fix.`,
        link: `/community/issues/view/${id}`
    });

    revalidatePath('/community/issues');

    // Send LINE notification for complete
    await sendLineNotificationForIssue('complete', {
        id: existingIssue.id,
        title: existingIssue.title,
        productId: existingIssue.productId,
    }, user.name || user.email || undefined);

    return issue;
}

export async function closeIssue(id: string) {
    const user = await requireUser();

    const existingIssue = await prisma.issue.findUnique({ where: { id } });
    if (!existingIssue) throw new Error("Issue not found");
    if (existingIssue.userId !== sessionUserId(user) && user.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    // Atomic: status mutation + activity log.
    const [issue] = await prisma.$transaction([
        prisma.issue.update({
            where: { id },
            data: {
                status: 'CLOSED',
                supportStatus: 'COMPLETED',
            },
        }),
        prisma.issueActivity.create({
            data: buildActivity({
                issueId: id,
                userId: sessionUserId(user),
                actorName: actorLabel(user),
                type: 'STATUS_CHANGE',
                description: `Issue closed and accepted by user.`,
            }),
        }),
    ]);

    // Clear all notifications for this issue as it is closed
    await markIssueNotificationsAsRead(id);

    // Notify Product Owner that User Closed/Accepted the issue
    if (existingIssue.productId) {
        const product = await prisma.product.findUnique({
            where: { id: existingIssue.productId },
            include: { owners: true }
        });

        if (product && product.owners) {
            for (const owner of product.owners) {
                await createNotification({
                    userId: owner.id,
                    productId: existingIssue.productId,
                    issueId: id,
                    type: "ISSUE_CLOSED",
                    title: "Issue Closed by User",
                    message: `User accepted and closed issue "${existingIssue.title}".`,
                    link: `/community/issues/view/${id}`
                });
            }
        }
    }

    revalidatePath('/community/issues');

    // Send LINE notification for close
    await sendLineNotificationForIssue('close', {
        id,
        title: existingIssue.title,
        productId: existingIssue.productId,
    }, user.name || user.email || undefined);

    return issue;
}

export async function rejectIssue(id: string) {
    const user = await requireUser();

    const existingIssue = await prisma.issue.findUnique({ where: { id } });
    if (!existingIssue) throw new Error("Issue not found");
    if (existingIssue.userId !== sessionUserId(user) && user.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    // Atomic: status mutation + activity log.
    const [issue] = await prisma.$transaction([
        prisma.issue.update({
            where: { id },
            data: {
                status: 'REJECTED',
                supportStatus: 'REJECTED',
            },
        }),
        prisma.issueActivity.create({
            data: buildActivity({
                issueId: id,
                userId: sessionUserId(user),
                actorName: actorLabel(user),
                type: 'STATUS_CHANGE',
                description: `Issue rejected by user with feedback.`,
            }),
        }),
    ]);

    // Clear user's "Complete" notification
    await markIssueNotificationsAsRead(id);

    // Notify support/owners
    // Since we don't easily know WHICH owner to notify, we might skip or notify all.
    // Ideally we notify the owners of the product.
    if (existingIssue.productId) {
        const product = await prisma.product.findUnique({
            where: { id: existingIssue.productId },
            include: { owners: true }
        });
        if (product && product.owners) {
            for (const owner of product.owners) {
                await createNotification({
                    userId: owner.id,
                    productId: existingIssue.productId,
                    issueId: id,
                    type: "ISSUE_REJECTED",
                    title: "Issue Rejected by User",
                    message: `User rejected fix for issue "${existingIssue.title}".`,
                    link: `/community/issues/view/${id}`
                });
            }
        }
    }

    revalidatePath('/community/issues');

    // Send LINE notification for reject
    await sendLineNotificationForIssue('reject', {
        id,
        title: existingIssue.title,
        productId: existingIssue.productId,
    }, user.name || user.email || undefined);

    return issue;
}

export async function resubmitIssue(id: string) {
    const user = await requireStaff();

    const existingIssue = await prisma.issue.findUnique({
        where: { id },
        select: { id: true, productId: true },
    });
    if (!existingIssue) throw new Error("Issue not found");

    // OWNER is scoped to products they own; ADMIN is global.
    if (user.role !== 'ADMIN' && !(await ownsProduct(sessionUserId(user), existingIssue.productId))) {
        throw new Error("Unauthorized");
    }

    // Atomic: status mutation + activity log.
    const [issue] = await prisma.$transaction([
        prisma.issue.update({
            where: { id },
            data: {
                supportStatus: 'COMPLETE',
                status: 'PENDING_REVIEW',
            },
        }),
        prisma.issueActivity.create({
            data: buildActivity({
                issueId: id,
                userId: sessionUserId(user),
                actorName: actorLabel(user),
                type: 'STATUS_CHANGE',
                description: `Issue resubmitted by support after fix.`,
            }),
        }),
    ]);

    revalidatePath('/community/issues');
    return issue;
}

export async function addIssueComment(data: {
    issueId: string;
    content: string;
    type: 'REJECTION' | 'RESUBMIT' | 'COMPLETE' | 'MESSAGE';
    imageUrls?: string[];
}) {
    const user = await requireUser();

    // Validate untrusted input (content length + type allowlist).
    const parsed = issueCommentSchema.parse(data);
    const self = sessionUserId(user);

    // Load the issue (with product owners) for authorization.
    const issue = await prisma.issue.findUnique({
        where: { id: parsed.issueId },
        include: { product: { include: { owners: true } } }
    });
    if (!issue) throw new Error("Issue not found");

    // Authorize: the reporter, an ADMIN, or an OWNER of this product may comment.
    const isReporter = issue.userId === self;
    const isAdmin = user.role === 'ADMIN';
    const isOwnerOfProduct = user.role === 'OWNER'
        && (issue.product?.owners?.some(owner => owner.id === self) ?? false);
    if (!isReporter && !isAdmin && !isOwnerOfProduct) {
        throw new Error("Unauthorized");
    }

    const comment = await prisma.issueComment.create({
        data: {
            content: parsed.content,
            type: parsed.type,
            issueId: parsed.issueId,
            userId: self,
        }
    });

    if (parsed.imageUrls && parsed.imageUrls.length > 0) {
        await prisma.issueCommentImage.createMany({
            data: parsed.imageUrls.map(url => ({ url, commentId: comment.id })),
        });
    }

    const activityVerb = parsed.type === 'MESSAGE' ? 'Sent a message' : `Added a ${parsed.type.toLowerCase()} comment`;
    await logActivity({
        issueId: parsed.issueId,
        userId: self,
        actorName: actorLabel(user),
        type: 'COMMENTED',
        description: `${activityVerb}: ${parsed.content.substring(0, 50)}${parsed.content.length > 50 ? '...' : ''}`
    });

    // Notify the other party. Route by who the author is *relative to this issue*
    // (not their global role): an admin who reported the issue counts as the
    // reporter, so a reply always reaches the opposite side.
    const authorIsReporter = self === issue.userId;

    if (!authorIsReporter) {
        // Dev/support replied → notify the reporter.
        await createNotification({
            userId: issue.userId,
            productId: issue.productId || undefined,
            issueId: issue.id,
            type: "ISSUE_COMMENT",
            title: "New Comment",
            message: `Support commented on your issue "${issue.title}": ${parsed.content}`,
            link: `/community/issues/view/${issue.id}`
        });
    } else {
        // Reporter replied → notify the whole Dev team: product owners AND all
        // admins (mirrors createIssue). This guarantees the reply reaches whoever
        // is handling the issue even when the handler is an admin who is not a
        // product owner, or when the issue has no product / no owners.
        const notifyIds = new Set<number>();
        issue.product?.owners?.forEach(owner => notifyIds.add(owner.id));
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true },
        });
        admins.forEach(a => notifyIds.add(a.id));
        notifyIds.delete(self);

        if (notifyIds.size > 0) {
            try {
                await prisma.notification.createMany({
                    data: Array.from(notifyIds).map(uid => ({
                        userId: uid,
                        productId: issue.productId || undefined,
                        issueId: issue.id,
                        type: "ISSUE_COMMENT",
                        title: "New Comment",
                        message: `User commented on issue "${issue.title}": ${parsed.content}`,
                        isRead: false,
                        link: `/community/issues/view/${issue.id}`,
                    })),
                });
            } catch (err) {
                console.error("Failed to create issue comment notifications:", err);
            }
        }
    }

    revalidatePath('/community/issues');

    // Send LINE notification for comment
    await sendLineNotificationForIssue('comment', {
        id: issue.id,
        title: issue.title,
        productId: issue.productId,
    }, user.name || user.email || undefined);

    return comment;
}

export async function getIssueComments(issueId: string) {
    const user = await requireUser();

    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        select: { userId: true, productId: true },
    });
    if (!issue) throw new Error("Issue not found");

    const self = sessionUserId(user);

    // Reporter or staff may view. OWNER (non-admin) must own the product.
    let authorized = issue.userId === self;
    if (!authorized && isStaff(user.role)) {
        authorized = user.role === 'ADMIN' || await ownsProduct(self, issue.productId);
    }
    if (!authorized) {
        throw new Error("Unauthorized");
    }

    const comments = await prisma.issueComment.findMany({
        where: { issueId },
        include: {
            user: { select: { name: true, email: true } },
            images: true
        },
        orderBy: { createdAt: 'desc' }
    });
    return comments;
}
export async function deleteIssue(id: string) {
    await requireAdmin();

    try {
        await prisma.issue.delete({
            where: { id }
        });

        revalidatePath('/community/issues', 'layout');
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting issue:", error);
        throw new Error(error?.message || "Failed to delete issue");
    }
}
