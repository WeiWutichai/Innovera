'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

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
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const product = await prisma.product.create({
        data
    });

    revalidatePath('/community');
    revalidatePath('/admin/community');
    revalidatePath('/admin/product-support');
    return product;
}

export async function updateProduct(id: string, data: { name?: string; description?: string; image?: string }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

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
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    await prisma.product.delete({
        where: { id }
    });

    revalidatePath('/community');
    revalidatePath('/admin/community');
    revalidatePath('/admin/product-support');
}


export async function getMyProducts() {
    const session = await auth();
    if (!session?.user?.id) {
        return [];
    }

    const user = await prisma.user.findUnique({
        where: { id: parseInt(session.user.id) },
        include: { products: true }
    });

    return user?.products || [];
}
