'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createNotification, markIssueNotificationsAsRead } from "./notification";
import { sendLineMulticastMessage, createIssueNotification } from "@/lib/line-messaging";

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

async function logActivity(data: {
    issueId: string;
    userId?: number;
    actorName?: string;
    type: string;
    description: string;
}) {
    // Using nested write to avoid direct accessor issues
    return await prisma.issue.update({
        where: { id: data.issueId },
        data: {
            activities: {
                create: {
                    userId: data.userId,
                    actorName: data.actorName,
                    type: data.type,
                    description: data.description,
                }
            }
        } as any
    });
}

export async function getIssues(productId?: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    // ADMIN and OWNER see all issues for the product
    // Regular users only see their own issues
    const userRole = session.user.role;
    const isOwnerOrAdmin = userRole === 'ADMIN' || userRole === 'OWNER';

    console.log('[getIssues] User role:', userRole, 'isOwnerOrAdmin:', isOwnerOrAdmin);

    let issues;
    if (isOwnerOrAdmin) {
        // Admin/Owner sees all issues
        issues = await prisma.issue.findMany({
            include: {
                user: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' }
        });
    } else {
        // Regular user sees only their own issues
        issues = await prisma.issue.findMany({
            where: {
                userId: parseInt(session.user.id),
            },
            include: {
                user: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Manual relation stitching (workaround)
    const products = await prisma.product.findMany({
        select: { id: true, name: true }
    });

    let mappedIssues = issues.map(issue => ({
        ...issue,
        product: products.find(p => p.id === (issue as any).productId) || null
    }));

    // In-memory filter for productId
    if (productId) {
        mappedIssues = mappedIssues.filter(issue => (issue as any).productId === productId);
    }

    return mappedIssues;
}


export async function createIssue(data: { title: string; description: string; productId?: string; imageUrls?: string[] }) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    if (!session.user.canReportIssues && session.user.role !== 'ADMIN') {
        throw new Error("Permission denied. You need approval to report issues.");
    }

    try {
        // 1. Create Issue without images first (to check if basic create works)
        const newIssue = await prisma.issue.create({
            data: {
                title: data.title,
                description: data.description,
                userId: parseInt(session.user.id),
                productId: data.productId,
            }
        });

        // 2. Create Images if any
        if (data.imageUrls && data.imageUrls.length > 0) {
            await prisma.issueImage.createMany({
                data: data.imageUrls.map(url => ({
                    url,
                    issueId: newIssue.id
                }))
            });
        }

        // 3. Log Activity
        await logActivity({
            issueId: newIssue.id,
            userId: parseInt(session.user.id),
            actorName: (session.user.name || session.user.email || 'Unknown'),
            type: 'CREATED',
            description: `Issue created: ${newIssue.title}`
        });

        // Notify product owners and admins
        if (data.productId) {
            const product = await prisma.product.findUnique({
                where: { id: data.productId },
                include: { owners: true }
            });

            const admins = await prisma.user.findMany({
                where: { role: 'ADMIN' }
            });

            // Combine owners and admins, remove duplicates and current user
            const currentUserId = parseInt(session.user.id);
            const notifyUsers = new Map<number, { id: number }>();

            if (product && product.owners) {
                product.owners.forEach(owner => notifyUsers.set(owner.id, owner));
            }
            admins.forEach(admin => notifyUsers.set(admin.id, admin));

            // Remove current user (creator)
            notifyUsers.delete(currentUserId);

            for (const user of notifyUsers.values()) {
                await createNotification({
                    userId: user.id,
                    productId: data.productId,
                    issueId: newIssue.id,
                    type: "ISSUE_CREATED",
                    title: "New Issue Reported",
                    message: `New issue "${data.title}" reported for ${product?.name || 'Product'}`,
                    link: `/community/issues/view/${newIssue.id}`
                });
            }
        }

        revalidatePath("/community/issues");
        if (data.productId) {
            revalidatePath(`/community/issues/product/${data.productId}`);
        }

        // Send LINE notification
        await sendLineNotificationForIssue('create', {
            id: newIssue.id,
            title: newIssue.title,
            productId: data.productId,
        }, session.user.name || session.user.email || undefined);

        return newIssue;
    } catch (error: any) {
        console.error("Error creating issue:", error);
        throw new Error(error?.message || "Failed to create issue. Please try again later.");
    }
}

export async function updateIssueStatus(id: string, status: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const issue = await prisma.issue.update({
        where: { id },
        data: { status }
    });

    await logActivity({
        issueId: id,
        userId: parseInt(session.user.id),
        actorName: (session.user.name || session.user.email || 'Unknown'),
        type: 'STATUS_CHANGE',
        description: `Issue status updated to ${status}`
    });

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

    const isOwner = session.user.role === 'OWNER' || session.user.role === 'ADMIN';
    if (!isOwner && issue.userId !== parseInt(session.user.id)) {
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
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const isOwner = session.user.role === 'OWNER' || session.user.role === 'ADMIN';
    if (!isOwner) throw new Error("Only Owners can accept issues");

    const issue = await prisma.issue.update({
        where: { id },
        data: { supportStatus: 'IN_PROGRESS' }
    });

    await logActivity({
        issueId: id,
        userId: parseInt(session.user.id),
        actorName: (session.user.name || session.user.email || 'Unknown'),
        type: 'STATUS_CHANGE',
        description: `Issue accepted by support. Support status: IN_PROGRESS`
    });

    // Clear previous notifications (e.g. New Issue Reported) for the owner
    await markIssueNotificationsAsRead(id);

    // Fetch issue details for notification
    const updatedIssue = await prisma.issue.findUnique({ where: { id } });
    if (updatedIssue) {
        await createNotification({
            userId: updatedIssue.userId,
            productId: updatedIssue.productId || undefined,
            issueId: id,
            type: "ISSUE_STATUS_UPDATE",
            title: "Issue Accepted",
            message: `Your issue "${updatedIssue.title}" has been accepted and is now In Progress.`,
            link: `/community/issues/view/${id}`
        });
    }

    revalidatePath('/community/issues');

    // Send LINE notification for accept
    const issueForLine = await prisma.issue.findUnique({ where: { id }, select: { id: true, title: true, productId: true } });
    if (issueForLine) {
        await sendLineNotificationForIssue('accept', issueForLine, session.user.name || session.user.email || undefined);
    }

    return issue;
}

export async function completeIssue(id: string, data?: { message?: string; imageUrls?: string[] }) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const isOwner = session.user.role === 'OWNER' || session.user.role === 'ADMIN';
    if (!isOwner) throw new Error("Only Owners can complete issues");

    const issue = await prisma.issue.update({
        where: { id },
        data: {
            supportStatus: 'COMPLETE',
            status: 'PENDING_REVIEW'
        }
    });

    // Save resolution comment if message provided
    if (data?.message) {
        const comment = await prisma.issueComment.create({
            data: {
                content: data.message,
                type: 'COMPLETE',
                issueId: id,
                userId: parseInt(session.user.id),
            }
        });

        if (data.imageUrls && data.imageUrls.length > 0) {
            for (const url of data.imageUrls) {
                await prisma.issueCommentImage.create({
                    data: {
                        url,
                        commentId: comment.id
                    }
                });
            }
        }
    }

    await logActivity({
        issueId: id,
        userId: parseInt(session.user.id),
        actorName: (session.user.name || session.user.email || 'Unknown'),
        type: 'STATUS_CHANGE',
        description: `Issue marked as complete by support.${data?.message ? ` Note: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}` : ''}`
    });

    // Clear previous notifications (e.g. New Issue for owner)
    await markIssueNotificationsAsRead(id);

    // Fetch issue details for notification
    const updatedIssue = await prisma.issue.findUnique({ where: { id } });
    if (updatedIssue) {
        await createNotification({
            userId: updatedIssue.userId,
            productId: updatedIssue.productId || undefined,
            issueId: id,
            type: "ISSUE_COMPLETE",
            title: "Issue Completed",
            message: `Support has marked your issue "${updatedIssue.title}" as Complete. Please review the fix.`,
            link: `/community/issues/view/${id}`
        });
    }

    revalidatePath('/community/issues');

    // Send LINE notification for complete
    const issueForLine = await prisma.issue.findUnique({ where: { id }, select: { id: true, title: true, productId: true } });
    if (issueForLine) {
        await sendLineNotificationForIssue('complete', issueForLine, session.user.name || session.user.email || undefined);
    }

    return issue;
}

export async function closeIssue(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const existingIssue = await prisma.issue.findUnique({ where: { id } });
    if (!existingIssue) throw new Error("Issue not found");
    if (existingIssue.userId !== parseInt(session.user.id) && session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const issue = await prisma.issue.update({
        where: { id },
        data: {
            status: 'CLOSED',
            supportStatus: 'COMPLETED'
        }
    });

    await logActivity({
        issueId: id,
        userId: parseInt(session.user.id),
        actorName: (session.user.name || session.user.email || 'Unknown'),
        type: 'STATUS_CHANGE',
        description: `Issue closed and accepted by user.`
    });

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
    }, session.user.name || session.user.email || undefined);

    return issue;
}

export async function rejectIssue(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const existingIssue = await prisma.issue.findUnique({ where: { id } });
    if (!existingIssue) throw new Error("Issue not found");
    if (existingIssue.userId !== parseInt(session.user.id) && session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const issue = await prisma.issue.update({
        where: { id },
        data: {
            status: 'REJECTED',
            supportStatus: 'REJECTED'
        }
    });

    await logActivity({
        issueId: id,
        userId: parseInt(session.user.id),
        actorName: (session.user.name || session.user.email || 'Unknown'),
        type: 'STATUS_CHANGE',
        description: `Issue rejected by user with feedback.`
    });

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
    }, session.user.name || session.user.email || undefined);

    return issue;
}

export async function resubmitIssue(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const isOwner = session.user.role === 'OWNER' || session.user.role === 'ADMIN';
    if (!isOwner) throw new Error("Only Owners can resubmit issues");

    const issue = await prisma.issue.update({
        where: { id },
        data: {
            supportStatus: 'COMPLETE',
            status: 'PENDING_REVIEW'
        }
    });

    await logActivity({
        issueId: id,
        userId: parseInt(session.user.id),
        actorName: (session.user.name || session.user.email || 'Unknown'),
        type: 'STATUS_CHANGE',
        description: `Issue resubmitted by support after fix.`
    });

    revalidatePath('/community/issues');
    return issue;
}

export async function addIssueComment(data: {
    issueId: string;
    content: string;
    type: 'REJECTION' | 'RESUBMIT' | 'COMPLETE';
    imageUrls?: string[];
}) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const comment = await prisma.issueComment.create({
        data: {
            content: data.content,
            type: data.type,
            issueId: data.issueId,
            userId: parseInt(session.user.id),
        }
    });

    if (data.imageUrls && data.imageUrls.length > 0) {
        for (const url of data.imageUrls) {
            await prisma.issueCommentImage.create({
                data: {
                    url,
                    commentId: comment.id
                }
            });
        }
    }

    await logActivity({
        issueId: data.issueId,
        userId: parseInt(session.user.id),
        actorName: (session.user.name || session.user.email || 'Unknown'),
        type: 'COMMENTED',
        description: `Added a ${data.type.toLowerCase()} comment: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`
    });

    // Notify the other party
    const issue = await prisma.issue.findUnique({
        where: { id: data.issueId },
        include: { product: { include: { owners: true } } }
    });

    if (issue) {
        const userRole = session.user.role;
        const isSupport = userRole === 'OWNER' || userRole === 'ADMIN';

        if (isSupport) {
            // Notify Issue Reporter
            await createNotification({
                userId: issue.userId,
                productId: issue.productId || undefined,
                issueId: issue.id,
                type: "ISSUE_COMMENT",
                title: "New Comment",
                message: `Support commented on your issue "${issue.title}": ${data.content}`,
                link: `/community/issues/view/${issue.id}`
            });
        } else {
            // Notify Product Owners
            if (issue.product && issue.product.owners) {
                for (const owner of issue.product.owners) {
                    await createNotification({
                        userId: owner.id,
                        productId: issue.productId || undefined,
                        issueId: issue.id,
                        type: "ISSUE_COMMENT",
                        title: "New Comment",
                        message: `User commented on issue "${issue.title}": ${data.content}`,
                        link: `/community/issues/view/${issue.id}`
                    });
                }
            }
        }
    }

    revalidatePath('/community/issues');

    // Send LINE notification for comment
    if (issue) {
        await sendLineNotificationForIssue('comment', {
            id: issue.id,
            title: issue.title,
            productId: issue.productId,
        }, session.user.name || session.user.email || undefined);
    }

    return comment;
}

export async function getIssueComments(issueId: string) {
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
    const session = await auth();
    const userRole = session?.user?.role;

    console.log(`[deleteIssue] Attempting to delete ID: ${id} by user role: ${userRole}`);

    if (userRole !== 'ADMIN') {
        throw new Error("Unauthorized: Only Admins can delete issues");
    }

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
