'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// ============ Categories ============

export async function getCategories(productId: string) {
    return await prisma.docCategory.findMany({
        where: { productId },
        orderBy: { order: 'asc' },
        include: {
            subcategories: {
                orderBy: { order: 'asc' },
                include: {
                    documents: {
                        orderBy: { order: 'asc' }
                    }
                }
            }
        }
    });
}

export async function getCategory(id: string) {
    return await prisma.docCategory.findUnique({
        where: { id },
        include: {
            subcategories: {
                orderBy: { order: 'asc' },
                include: {
                    documents: {
                        orderBy: { order: 'asc' }
                    }
                }
            }
        }
    });
}

export async function createCategory(data: { name: string; productId: string; order?: number }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const category = await prisma.docCategory.create({
        data
    });

    revalidatePath(`/admin/product-support/products/${data.productId}`);
    revalidatePath(`/community/products/${data.productId}`);
    return category;
}

export async function updateCategory(id: string, data: { name?: string; order?: number }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const category = await prisma.docCategory.update({
        where: { id },
        data
    });

    revalidatePath(`/admin/product-support/products/${category.productId}`);
    revalidatePath(`/community/products/${category.productId}`);
    return category;
}

export async function deleteCategory(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const category = await prisma.docCategory.delete({
        where: { id }
    });

    revalidatePath(`/admin/product-support/products/${category.productId}`);
    revalidatePath(`/community/products/${category.productId}`);
}

// ============ Subcategories ============

export async function getSubcategory(id: string) {
    return await prisma.docSubcategory.findUnique({
        where: { id },
        include: {
            documents: {
                orderBy: { order: 'asc' }
            },
            category: true
        }
    });
}

export async function createSubcategory(data: { name: string; categoryId: string; order?: number }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const subcategory = await prisma.docSubcategory.create({
        data,
        include: { category: true }
    });

    revalidatePath(`/admin/product-support/products/${subcategory.category.productId}`);
    revalidatePath(`/community/products/${subcategory.category.productId}`);
    return subcategory;
}

export async function updateSubcategory(id: string, data: { name?: string; order?: number }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const subcategory = await prisma.docSubcategory.update({
        where: { id },
        data,
        include: { category: true }
    });

    revalidatePath(`/admin/product-support/products/${subcategory.category.productId}`);
    revalidatePath(`/community/products/${subcategory.category.productId}`);
    return subcategory;
}

export async function deleteSubcategory(id: string) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const subcategory = await prisma.docSubcategory.delete({
        where: { id },
        include: { category: true }
    });

    revalidatePath(`/admin/product-support/products/${subcategory.category.productId}`);
    revalidatePath(`/community/products/${subcategory.category.productId}`);
}
