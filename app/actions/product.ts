'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser, sessionUserId } from "@/lib/auth-helpers";

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function getProduct(id: string) {
    return await prisma.product.findUnique({
        where: { id },
        include: { documents: true }
    });
}

export async function createProduct(data: { name: string; description?: string; image?: string }) {
    await requireAdmin();

    const product = await prisma.product.create({
        data
    });

    revalidatePath('/community');
    revalidatePath('/admin/community');
    revalidatePath('/admin/product-support');
    return product;
}

export async function updateProduct(id: string, data: { name?: string; description?: string; image?: string }) {
    await requireAdmin();

    const product = await prisma.product.update({
        where: { id },
        data
    });

    revalidatePath('/community');
    revalidatePath(`/community/products/${id}`);
    revalidatePath('/admin/product-support');
    revalidatePath(`/admin/product-support/products/${id}`);
    return product;
}

export async function deleteProduct(id: string) {
    await requireAdmin();

    await prisma.product.delete({
        where: { id }
    });

    revalidatePath('/community');
    revalidatePath('/admin/community');
    revalidatePath('/admin/product-support');
}


export async function getMyProducts() {
    const sessionUser = await requireUser();

    const user = await prisma.user.findUnique({
        where: { id: sessionUserId(sessionUser) },
        select: { products: true }
    });

    return user?.products || [];
}
