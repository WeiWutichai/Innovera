'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

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

        revalidatePath("/community/issues");
        if (data.productId) {
            revalidatePath(`/community/issues/product/${data.productId}`);
        }

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

    revalidatePath('/community/issues');
    return issue;
}

export async function completeIssue(id: string) {
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

    await logActivity({
        issueId: id,
        userId: parseInt(session.user.id),
        actorName: (session.user.name || session.user.email || 'Unknown'),
        type: 'STATUS_CHANGE',
        description: `Issue marked as complete by support. Waiting for user review.`
    });

    revalidatePath('/community/issues');
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

    revalidatePath('/community/issues');
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

    revalidatePath('/community/issues');
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
    type: 'REJECTION' | 'RESUBMIT';
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

    revalidatePath('/community/issues');
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

    if (userRole !== 'ADMIN' && userRole !== 'OWNER') {
        throw new Error("Unauthorized: Only Admins or Owners can delete issues");
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
