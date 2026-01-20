import { getProducts, createProduct, deleteProduct } from "@/app/actions/product";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminCommunityPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const products = await getProducts();

    async function handleAddProduct(formData: FormData) {
        'use server'
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const image = formData.get('image') as string;

        if (!name) return;

        await createProduct({ name, description, image });
        revalidatePath('/admin/community');
    }

    async function handleDeleteProduct(formData: FormData) {
        'use server'
        const id = formData.get('id') as string;
        await deleteProduct(id);
        revalidatePath('/admin/community');
    }

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Manage Community Content</h1>
                <Link href="/admin/users" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    Manage Users <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-[#1E293B] p-6 rounded-lg border border-white/5 shadow-xl sticky top-4">
                        <h2 className="text-lg font-bold mb-4 text-white">Add New Product</h2>
                        <form action={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Product Name</label>
                                <input type="text" name="name" required className="w-full bg-[#0F172A] border border-white/10 rounded p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
                                <textarea name="description" rows={3} className="w-full bg-[#0F172A] border border-white/10 rounded p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-300">Image URL</label>
                                <input type="text" name="image" className="w-full bg-[#0F172A] border border-white/10 rounded p-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium transition-colors">
                                Create Product
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-lg font-bold mb-4">Products ({products.length})</h2>
                    <div className="space-y-4">
                        {products.map(product => (
                            <div key={product.id} className="bg-[#1E293B] border border-white/5 p-4 rounded-lg shadow-sm flex justify-between items-center group hover:bg-[#253248] transition-colors">
                                <div className="flex items-center gap-4">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded bg-gray-800" />
                                    ) : (
                                        <div className="w-16 h-16 bg-[#0F172A] rounded flex items-center justify-center text-xs text-gray-500 border border-white/5">No Img</div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-white">{product.name}</h3>
                                        <p className="text-sm text-gray-400 line-clamp-1">{product.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/community/products/${product.id}`} className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 text-sm text-gray-300 transition-colors">
                                        Manage Docs
                                    </Link>
                                    <form action={handleDeleteProduct} onSubmit={(e) => { if (!confirm('Delete product?')) e.preventDefault() }}>
                                        <input type="hidden" name="id" value={product.id} />
                                        <button type="submit" className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 text-sm border border-red-500/10 transition-colors">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
