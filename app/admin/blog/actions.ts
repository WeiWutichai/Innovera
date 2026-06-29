
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, sessionUserId } from "@/lib/auth-helpers";

export async function createPost(formData: FormData) {
    const user = await requireAdmin();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const image = formData.get("image") as string;
    const title_th = formData.get("title_th") as string;
    const content_th = formData.get("content_th") as string;
    const excerpt_th = formData.get("excerpt_th") as string;
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const metaKeywords = formData.get("metaKeywords") as string;
    const metaTitle_th = formData.get("metaTitle_th") as string;
    const metaDescription_th = formData.get("metaDescription_th") as string;
    const metaKeywords_th = formData.get("metaKeywords_th") as string;

    // Basic validation
    if (!title || !slug || !content) {
        throw new Error("Missing required fields");
    }

    await prisma.post.create({
        data: {
            title,
            slug,
            content,
            excerpt,
            image,
            title_th,
            content_th,
            excerpt_th,
            metaTitle,
            metaDescription,
            metaKeywords,
            metaTitle_th,
            metaDescription_th,
            metaKeywords_th,
            published: true, // Auto publish for now
            authorId: sessionUserId(user),
        },
    });

    revalidatePath("/admin/blog");
    redirect("/admin/blog");
}

export async function updatePost(postId: number, formData: FormData) {
    await requireAdmin();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const image = formData.get("image") as string;
    const title_th = formData.get("title_th") as string;
    const content_th = formData.get("content_th") as string;
    const excerpt_th = formData.get("excerpt_th") as string;
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const metaKeywords = formData.get("metaKeywords") as string;
    const metaTitle_th = formData.get("metaTitle_th") as string;
    const metaDescription_th = formData.get("metaDescription_th") as string;
    const metaKeywords_th = formData.get("metaKeywords_th") as string;

    // Basic validation
    if (!title || !slug || !content) {
        throw new Error("Missing required fields");
    }

    await prisma.post.update({
        where: { id: postId },
        data: {
            title,
            slug,
            content,
            excerpt,
            image,
            title_th,
            content_th,
            excerpt_th,
            metaTitle,
            metaDescription,
            metaKeywords,
            metaTitle_th,
            metaDescription_th,
            metaKeywords_th,
        },
    });

    revalidatePath("/admin/blog");
    redirect("/admin/blog");
}

export async function deletePost(postId: number) {
    await requireAdmin();

    await prisma.post.delete({
        where: { id: postId },
    });

    revalidatePath("/admin/blog");
}
