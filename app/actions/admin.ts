'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { sendApprovalEmail } from "@/lib/email";

export async function getPendingUsers() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    return await prisma.user.findMany({
        where: { isApproved: false },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getAllUsers() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { products: true }
    });
}

export async function getUser(userId: number) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    return await prisma.user.findUnique({
        where: { id: userId },
        include: { products: true }
    });
}

export async function approveUser(userId: number) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { isApproved: true }
    });

    // Send email
    await sendApprovalEmail(user.email, user.name || 'User');

    revalidatePath('/admin/users');
    return user;
}

export async function updateUserRole(userId: number, role: Role, canReportIssues: boolean) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { role, canReportIssues }
    });

    revalidatePath('/admin/users');
    return user;
}

export async function assignProductToUser(userId: number, productId: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            products: {
                connect: { id: productId }
            }
        }
    });

    revalidatePath('/admin/users');
    return user;
}

export async function removeProductFromUser(userId: number, productId: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            products: {
                disconnect: { id: productId }
            }
        }
    });

    revalidatePath('/admin/users');
    return user;
}

export async function assignAllProductsToUser(userId: number) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

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
    return user;
}
