'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Get all LINE users with their product assignments
 */
export async function getLineUsers() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'OWNER') {
        throw new Error('Unauthorized');
    }

    const lineUsers = await prisma.lineUser.findMany({
        include: {
            products: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return lineUsers;
}

/**
 * Get a single LINE user by ID
 */
export async function getLineUserById(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'OWNER') {
        throw new Error('Unauthorized');
    }

    const lineUser = await prisma.lineUser.findUnique({
        where: { id },
        include: {
            products: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return lineUser;
}

/**
 * Assign products to a LINE user
 */
export async function assignProductsToLineUser(lineUserId: string, productIds: string[]) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'OWNER') {
        throw new Error('Unauthorized');
    }

    await prisma.lineUser.update({
        where: { id: lineUserId },
        data: {
            products: {
                set: productIds.map(id => ({ id })),
            },
        },
    });

    revalidatePath('/admin/users');
    return { success: true };
}

/**
 * Remove a LINE user from a specific product
 */
export async function removeLineUserFromProduct(lineUserId: string, productId: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'OWNER') {
        throw new Error('Unauthorized');
    }

    await prisma.lineUser.update({
        where: { id: lineUserId },
        data: {
            products: {
                disconnect: { id: productId },
            },
        },
    });

    revalidatePath('/admin/users');
    return { success: true };
}

/**
 * Delete a LINE user
 */
export async function deleteLineUser(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'OWNER') {
        throw new Error('Unauthorized');
    }

    await prisma.lineUser.delete({
        where: { id },
    });

    revalidatePath('/admin/users');
    return { success: true };
}

/**
 * Get LINE users assigned to a specific product
 */
export async function getLineUsersForProduct(productId: string) {
    const lineUsers = await prisma.lineUser.findMany({
        where: {
            products: {
                some: { id: productId },
            },
        },
        select: {
            lineUserId: true,
            displayName: true,
        },
    });

    return lineUsers;
}
