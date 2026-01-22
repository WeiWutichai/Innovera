import { getProducts, deleteProduct } from "@/app/actions/product";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import DeleteButton from "../components/DeleteButton";
import CreateProductButton from "../components/CreateProductButton";
import { Package, FileText, ChevronRight } from "lucide-react";

export default async function ProductSupportPage() {
    let session;
    try {
        session = await auth();
    } catch (error) {
        console.error("ProductSupportPage Auth Error:", error);
        redirect('/');
    }

    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const products = await getProducts();

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Product Support</h1>
                    <p className="text-gray-500">Manage products and documentation.</p>
                </div>
                <CreateProductButton />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-lg font-semibold text-gray-800">Products ({products.length})</h2>
                    </div>
                    <div className="space-y-3">
                        {products.map(product => (
                            <div key={product.id} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex justify-between items-center group hover:shadow-md hover:border-indigo-200 transition-all">
                                <div className="flex items-center gap-4">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                                            <Package className="w-8 h-8 text-indigo-500" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-gray-900">{product.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href={`/admin/product-support/products/${product.id}`} className="flex items-center gap-1 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 text-sm text-indigo-600 font-medium transition-colors">
                                        <FileText className="w-4 h-4" />
                                        Manage Docs
                                    </Link>
                                    <DeleteButton action={deleteProduct} id={product.id} itemName="product" />
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && (
                            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No products found. Click "Create Product" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
