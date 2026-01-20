import { getProducts, deleteProduct } from "@/app/actions/product";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import DeleteButton from "../components/DeleteButton";
import CreateProductButton from "../components/CreateProductButton";

export default async function ProductSupportPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const products = await getProducts();

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Product Support</h1>
                    <p className="text-gray-400">Manage products and documentation.</p>
                </div>
                <CreateProductButton />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="col-span-1">
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
                                    <Link href={`/admin/product-support/products/${product.id}`} className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 text-sm text-gray-300 transition-colors">
                                        Manage Docs
                                    </Link>
                                    <DeleteButton action={deleteProduct} id={product.id} itemName="product" />
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <div className="text-center py-12 bg-[#1E293B] rounded-lg border border-white/5">
                                <p className="text-gray-400">No products found. Click "Create Product" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
