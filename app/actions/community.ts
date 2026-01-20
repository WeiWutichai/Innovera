'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

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
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const post = await prisma.communityPost.create({
        data: {
            ...data,
            userId: parseInt(session.user.id)
        }
    });

    revalidatePath('/community/forum');
    return post;
}

export async function createComment(postId: string, content: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const comment = await prisma.comment.create({
        data: {
            content,
            postId,
            userId: parseInt(session.user.id)
        }
    });

    revalidatePath(`/community/forum/${postId}`);
    return comment;
}

export async function deletePost(postId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    await prisma.communityPost.delete({
        where: { id: postId }
    });

    revalidatePath('/community/forum');
}
