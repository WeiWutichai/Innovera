'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AuthError, isStaff, requireUser, sessionUserId } from "@/lib/auth-helpers";

export async function getPosts() {
    return await prisma.communityPost.findMany({
        include: {
            user: { select: { name: true, image: true } },
            _count: { select: { comments: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getPost(id: string) {
    return await prisma.communityPost.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, image: true } },
            comments: {
                include: { user: { select: { name: true, image: true } } },
                orderBy: { createdAt: 'asc' }
            }
        }
    });
}

export async function createPost(data: { title: string; content: string }) {
    const user = await requireUser();

    const post = await prisma.communityPost.create({
        data: {
            ...data,
            userId: sessionUserId(user)
        }
    });

    revalidatePath('/community/forum');
    return post;
}

export async function createComment(postId: string, content: string) {
    const user = await requireUser();

    const comment = await prisma.comment.create({
        data: {
            content,
            postId,
            userId: sessionUserId(user)
        }
    });

    revalidatePath(`/community/forum/${postId}`);
    return comment;
}

export async function deletePost(postId: string) {
    const user = await requireUser();

    const post = await prisma.communityPost.findUnique({
        where: { id: postId },
        select: { userId: true }
    });

    if (!post) {
        throw new Error("Post not found");
    }

    // Only the post author or staff (ADMIN/OWNER) may delete a post.
    if (post.userId !== sessionUserId(user) && !isStaff(user.role)) {
        throw new AuthError("Forbidden", 403);
    }

    await prisma.communityPost.delete({
        where: { id: postId }
    });

    revalidatePath('/community/forum');
}
