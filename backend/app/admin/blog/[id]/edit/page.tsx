
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditPostForm from "./EditPostForm";

interface EditPostPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;

    // Validate ID is a number
    const postId = parseInt(id);
    if (isNaN(postId)) {
        notFound();
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#050505] p-8 font-nunito">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Edit Post</h1>
                <EditPostForm post={post} />
            </div>
        </div>
    );
}
