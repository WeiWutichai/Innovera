"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { requireUser, sessionUserId } from "@/lib/auth-helpers";

export async function createNotification(data: {
    userId: number;
    productId?: string;
    issueId?: string;
    type: string;
    title: string;
    message: string;
    link?: string;
}) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            console.error("createNotification called without authentication");
            return;
        }
        await prisma.notification.create({
            data: {
                userId: data.userId,
                productId: data.productId,
                issueId: data.issueId,
                type: data.type,
                title: data.title,
                message: data.message,
                link: data.link,
                isRead: false
            }
        });
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
}

export async function markIssueNotificationsAsRead(issueId: string, exceptTypes?: string[]) {
    try {
        await prisma.notification.updateMany({
            where: {
                issueId: issueId,
                isRead: false,
                // Optionally preserve certain notification types (e.g. an
                // "action needed" reminder) while clearing everything else.
                ...(exceptTypes && exceptTypes.length > 0 ? { type: { notIn: exceptTypes } } : {}),
            },
            data: {
                isRead: true
            }
        });
    } catch (error) {
        console.error("Failed to mark issue notifications as read:", error);
    }
}

export async function getUnreadCountsByProduct() {
    const user = await requireUser();

    try {
        const userId = sessionUserId(user);

        const notifications = await prisma.notification.findMany({
            where: {
                userId: userId,
                isRead: false,
                productId: { not: null }
            },
            select: {
                productId: true
            }
        });

        const counts: Record<string, number> = {};
        notifications.forEach((n: { productId: string | null }) => {
            if (n.productId) {
                counts[n.productId] = (counts[n.productId] || 0) + 1;
            }
        });

        return counts;
    } catch (error) {
        console.error("Failed to get notification counts:", error);
        return {};
    }
}

export async function markNotificationsAsRead(productId: string) {
    const user = await requireUser();

    try {
        const userId = sessionUserId(user);
        await prisma.notification.updateMany({
            where: {
                userId: userId,
                productId: productId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });
    } catch (error) {
        console.error("Failed to mark notifications as read:", error);
        throw error;
    }
}
