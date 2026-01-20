import { getProduct } from "@/app/actions/product";
import { getDocuments, createDocument, deleteDocument } from "@/app/actions/document";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminProductPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const product = await getProduct(params.id);
    if (!product) redirect('/admin/community');

    const documents = await getDocuments(params.id);

    async function handleAddDocument(formData: FormData) {
        'use server'
        const title = formData.get('title') as string;
        const content = formData.get('content') as string; // Ideally this would come from a rich text editor client component
        const category = formData.get('category') as string;
        const videoUrl = formData.get('videoUrl') as string;
        const order = parseInt(formData.get('order') as string) || 0;

        await createDocument({
            title, content, category, videoUrl, order, productId: params.id
        });

        revalidatePath(`/admin/community/products/${params.id}`);
    }

    async function handleDeleteDocument(formData: FormData) {
        'use server'
        const id = formData.get('id') as string;
        await deleteDocument(id);
        revalidatePath(`/admin/community/products/${params.id}`);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/admin/community" className="text-blue-600 hover:underline mb-4 block">&larr; Back to Dashboard</Link>

            <h1 className="text-2xl font-bold mb-8">Manage Documents for: {product.name}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h2 className="text-lg font-bold mb-4">Add New Document</h2>
                    <form action={handleAddDocument} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input type="text" name="title" required className="w-full border rounded p-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <input type="text" name="category" className="w-full border rounded p-2" placeholder="e.g. Getting Started" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Sort Order</label>
                                <input type="number" name="order" className="w-full border rounded p-2" defaultValue={0} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Video URL (YouTube)</label>
                            <input type="text" name="videoUrl" className="w-full border rounded p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Content (HTML/Text)</label>
                            <textarea name="content" required rows={10} className="w-full border rounded p-2 font-mono text-sm"></textarea>
                            <p className="text-xs text-gray-500 mt-1">Accepts HTML for images and formatting.</p>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Create Document
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold">Existing Documents ({documents.length})</h2>
                    {documents.map(doc => (
                        <div key={doc.id} className="bg-white border p-4 rounded shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold">{doc.title}</h3>
                                <form action={handleDeleteDocument}>
                                    <input type="hidden" name="id" value={doc.id} />
                                    <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                                </form>
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500 mb-2">
                                <span className="bg-gray-100 px-2 py-0.5 rounded">Category: {doc.category || 'None'}</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded">Order: {doc.order}</span>
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-2 rounded font-mono">
                                {doc.content.substring(0, 100)}...
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
