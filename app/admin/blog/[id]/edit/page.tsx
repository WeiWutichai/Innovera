
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
        <div className="min-h-screen bg-gray-50 p-8 font-nunito">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
                    <p className="text-gray-500">Update your blog post content and SEO settings.</p>
                </div>
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                    <EditPostForm post={post} />
                </div>
            </div>
        </div>
    );
}
