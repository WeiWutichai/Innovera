'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

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
                // images: { create: ... } // Removed nested write to avoid potential Prisma client validation issues in dev
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

        revalidatePath("/community/issues");
        if (data.productId) {
            revalidatePath(`/community/issues/product/${data.productId}`);
        }

        return newIssue;
    } catch (error: any) {
        console.error("Error creating issue:", error);
        // Surface the actual error for debugging
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
        }
    });

    if (!issue) {
        throw new Error("Issue not found");
    }

    // Check access: Admin/Owner can see all, User can only see their own
    const isOwner = session.user.role === 'OWNER' || session.user.role === 'ADMIN';
    if (!isOwner && issue.userId !== parseInt(session.user.id)) {
        throw new Error("Unauthorized");
    }

    // Fetch images separately (workaround for cache issue)
    const images = await prisma.issueImage.findMany({
        where: { issueId: id },
        select: { id: true, url: true }
    });

    // Fetch product info
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
        product
    };
}

// Owner/Support accepts the issue - changes supportStatus to IN_PROGRESS
export async function acceptIssue(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const isOwner = session.user.role === 'OWNER' || session.user.role === 'ADMIN';
    if (!isOwner) throw new Error("Only Owners can accept issues");

    const issue = await prisma.issue.update({
        where: { id },
        data: { supportStatus: 'IN_PROGRESS' }
    });

    revalidatePath('/community/issues');
    return issue;
}

// Owner/Support completes the fix - changes supportStatus to COMPLETE, status to PENDING_REVIEW
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

    revalidatePath('/community/issues');
    return issue;
}

// User closes the issue (accepts the fix) - changes status to CLOSED, supportStatus to COMPLETED
export async function closeIssue(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify user owns this issue
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

    revalidatePath('/community/issues');
    return issue;
}

// User rejects the fix - changes both statuses to REJECTED
export async function rejectIssue(id: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Verify user owns this issue
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

    revalidatePath('/community/issues');
    return issue;
}
