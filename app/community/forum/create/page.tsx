import { auth } from "@/auth";
import Link from "next/link";
import CreatePostForm from "./CreatePostForm";

export default async function CreatePostPage() {
    const session = await auth();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href="/community/forum" className="hover:text-blue-600">Forum</Link>
                <span>/</span>
                <span className="font-semibold text-gray-900">New Topic</span>
            </div>

            <h1 className="text-3xl font-bold mb-8">Create a New Topic</h1>

            <CreatePostForm isLoggedIn={!!session} />
        </div>
    );
}
