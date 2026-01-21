import { getUser, updateUserRole } from "@/app/actions/admin";
import { getProducts } from "@/app/actions/product";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserRoleSelector from "../UserRoleSelector";
import UserProductManager from "../UserProductManager";
import ResetPasswordButton from "../ResetPasswordButton";
import { ArrowLeft, Package, Activity, User } from "lucide-react";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const { id } = await params;
    const userId = parseInt(id);
    if (isNaN(userId)) {
        redirect('/admin/users');
    }

    const user = await getUser(userId);
    if (!user) {
        return <div className="text-gray-900 p-8">User not found</div>;
    }

    const allProducts = await getProducts();

    return (
        <div className="container mx-auto">
            <div className="mb-8">
                <Link href="/admin/users" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mb-6 font-medium transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Users
                </Link>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-3xl shadow-lg overflow-hidden">
                            {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                            <p className="text-gray-500 mb-2">{user.email}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>Joined: {user.createdAt.toLocaleDateString()}</span>
                                <span>ID: #{user.id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <ResetPasswordButton userId={user.id} userEmail={user.email} />
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <label className="block text-xs uppercase text-gray-500 mb-2 font-semibold">User Role</label>
                            <UserRoleSelector userId={user.id} currentRole={user.role} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-lg font-bold text-gray-900">Managed Products</h2>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">{user.products.length} Assigned</span>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <p className="text-gray-500 mb-4 text-sm">
                                    Assign products that this user is responsible for. As an OWNER, they will have specific access to these products.
                                </p>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <UserProductManager
                                        userId={user.id}
                                        assignedProducts={user.products}
                                        allProducts={allProducts}
                                    />
                                </div>
                            </div>

                            {user.products.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.products.map(product => (
                                        <div key={product.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-indigo-500" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-sm text-gray-900">{product.name}</h3>
                                                <Link href={`/admin/product-support/products/${product.id}`} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                                                    Manage Docs →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-bold text-gray-900">Activity Summary</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-500">Total Posts</span>
                                <span className="text-gray-900 font-medium">-</span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-500">Issues Reported</span>
                                <span className="text-gray-900 font-medium">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
