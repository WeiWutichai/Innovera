import { getProduct } from "@/app/actions/product";
import { getDocuments, createDocument, deleteDocument } from "@/app/actions/document";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import DeleteButton from "../../../components/DeleteButton";
import EditProductButton from "../../../components/EditProductButton";

export default async function ProductDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const { id } = await params;
    const product = await getProduct(id);
    if (!product) redirect('/admin/product-support');

    const documents = await getDocuments(id);

    async function handleAddDocument(formData: FormData) {
        'use server'
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const category = formData.get('category') as string;
        const videoUrl = formData.get('videoUrl') as string;
        const order = parseInt(formData.get('order') as string) || 0;

        await createDocument({
            title, content, category, videoUrl, order, productId: id
        });

        revalidatePath(`/admin/product-support/products/${id}`);
    }

    async function handleDeleteDocument(formData: FormData) {
        'use server'
        const docId = formData.get('id') as string;
        await deleteDocument(docId);
        revalidatePath(`/admin/product-support/products/${id}`);
    }

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <Link href="/admin/product-support" className="text-blue-400 hover:text-blue-300 mb-4 block flex items-center gap-1 transition-colors">
                <span aria-hidden="true">&larr;</span> Back to Product Support
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Manage Documents for: <span className="text-blue-400">{product.name}</span></h1>
                <EditProductButton product={product} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#1E293B] p-6 rounded-lg border border-white/5 shadow-xl sticky top-4">
                    <h2 className="text-lg font-bold mb-4 text-white">Add New Document</h2>
                    <form action={handleAddDocument} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Title</label>
                            <input type="text" name="title" required className="w-full bg-[#0F172A] border border-white/10 rounded p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Category</label>
                                <input type="text" name="category" className="w-full bg-[#0F172A] border border-white/10 rounded p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Getting Started" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Sort Order</label>
                                <input type="number" name="order" className="w-full bg-[#0F172A] border border-white/10 rounded p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" defaultValue={0} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Video URL (YouTube)</label>
                            <input type="text" name="videoUrl" className="w-full bg-[#0F172A] border border-white/10 rounded p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Content (HTML/Text)</label>
                            <textarea name="content" required rows={10} className="w-full bg-[#0F172A] border border-white/10 rounded p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"></textarea>
                            <p className="text-xs text-gray-500 mt-1">Accepts HTML for images and formatting.</p>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium transition-colors">
                            Create Document
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-bold mb-4">Existing Documents ({documents.length})</h2>
                    {documents.map(doc => (
                        <div key={doc.id} className="bg-[#1E293B] border border-white/5 p-4 rounded-lg shadow-sm group hover:bg-[#253248] transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{doc.title}</h3>
                                <DeleteButton action={deleteDocument} id={doc.id} itemName="document" />
                            </div>
                            <div className="flex gap-2 text-xs text-gray-400 mb-2">
                                <span className="bg-[#0F172A] border border-white/5 px-2 py-0.5 rounded">Category: {doc.category || 'None'}</span>
                                <span className="bg-[#0F172A] border border-white/5 px-2 py-0.5 rounded">Order: {doc.order}</span>
                            </div>
                            <div className="text-sm text-gray-400 line-clamp-3 bg-[#0F172A] border border-white/5 p-2 rounded font-mono">
                                {doc.content.substring(0, 100)}...
                            </div>
                        </div>
                    ))}
                    {documents.length === 0 && (
                        <div className="text-gray-500 text-center py-8 bg-[#1E293B] rounded-lg border border-white/5">
                            No documents found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
