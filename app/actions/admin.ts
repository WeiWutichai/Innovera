'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { sendApprovalEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/auth-helpers";

export async function getPendingUsers() {
    await requireAdmin();

    const users = await prisma.user.findMany({
        where: { isApproved: false },
        orderBy: { createdAt: 'desc' }
    });

    return users.map(({ password, ...rest }) => rest);
}

export async function getAllUsers() {
    await requireAdmin();

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { products: true }
    });

    return users.map(({ password, ...rest }) => rest);
}

export async function getUser(userId: number) {
    await requireAdmin();

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { products: true }
    });

    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
}

export async function approveUser(userId: number) {
    await requireAdmin();

    const user = await prisma.user.update({
        where: { id: userId },
        data: { isApproved: true }
    });

    // Send email
    await sendApprovalEmail(user.email, user.name || 'User');

    revalidatePath('/admin/users');
    const { password, ...rest } = user;
    return rest;
}

export async function updateUserRole(userId: number, role: Role, canReportIssues: boolean) {
    await requireAdmin();

    const user = await prisma.user.update({
        where: { id: userId },
        data: { role, canReportIssues }
    });

    revalidatePath('/admin/users');
    const { password, ...rest } = user;
    return rest;
}

export async function assignProductToUser(userId: number, productId: string) {
    await requireAdmin();

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            products: {
                connect: { id: productId }
            }
        }
    });

    revalidatePath('/admin/users');
    const { password, ...rest } = user;
    return rest;
}

export async function removeProductFromUser(userId: number, productId: string) {
    await requireAdmin();

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            products: {
                disconnect: { id: productId }
            }
        }
    });

    revalidatePath('/admin/users');
    const { password, ...rest } = user;
    return rest;
}

export async function assignAllProductsToUser(userId: number) {
    await requireAdmin();

    const allProducts = await prisma.product.findMany({ select: { id: true } });
    const productIds = allProducts.map(p => ({ id: p.id }));

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            products: {
                connect: productIds
            }
        }
    });

    revalidatePath('/admin/users');
    const { password, ...rest } = user;
    return rest;
}
