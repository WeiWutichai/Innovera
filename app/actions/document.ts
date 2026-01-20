'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getDocuments(productId: string) {
    return await prisma.document.findMany({
        where: { productId },
        orderBy: { order: 'asc' }
    });
}

export async function getDocument(id: string) {
    return await prisma.document.findUnique({
        where: { id },
        include: { product: true }
    });
}

export async function createDocument(data: { title: string; content: string; productId: string; category?: string; videoUrl?: string; order?: number }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const document = await prisma.document.create({
        data
    });

    revalidatePath(`/community/products/${data.productId}`);
    revalidatePath(`/admin/product-support/products/${data.productId}`);
    return document;
}

export async function updateDocument(id: string, data: { title?: string; content?: string; category?: string; videoUrl?: string; order?: number }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const document = await prisma.document.update({
        where: { id },
        data
    });

    revalidatePath(`/community/docs/${id}`);
    revalidatePath(`/admin/product-support/products/${document.productId}`);
    return document;
}

export async function deleteDocument(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const doc = await prisma.document.delete({
        where: { id }
    });

    revalidatePath(`/community/products/${doc.productId}`);
    revalidatePath(`/admin/product-support/products/${doc.productId}`);
}
