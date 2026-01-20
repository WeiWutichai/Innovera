import { getUser, updateUserRole } from "@/app/actions/admin";
import { getProducts } from "@/app/actions/product";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserRoleSelector from "../UserRoleSelector";
import UserProductManager from "../UserProductManager";
import ResetPasswordButton from "../ResetPasswordButton";

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
        return <div className="text-white p-8">User not found</div>;
    }

    const allProducts = await getProducts();

    return (
        <div className="container mx-auto px-6 py-8 text-white">
            <div className="mb-8">
                <Link href="/admin/users" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Users
                </Link>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-4xl border-2 border-white/10 overflow-hidden">
                            {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                            <p className="text-gray-400 mb-2">{user.email}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Joined: {user.createdAt.toLocaleDateString()}</span>
                                <span>ID: #{user.id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <ResetPasswordButton userId={user.id} userEmail={user.email} />
                        <div className="bg-[#1E293B] p-4 rounded-xl border border-white/5">
                            <label className="block text-xs uppercase text-gray-400 mb-2 font-semibold">User Role</label>
                            <UserRoleSelector userId={user.id} currentRole={user.role} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-[#1E293B] rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Managed Products</h2>
                            <span className="text-sm text-gray-400">{user.products.length} Assigned</span>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <p className="text-gray-400 mb-4">
                                    Assign products that this user is responsible for. As an OWNER, they will have specific access to these products.
                                </p>
                                <div className="bg-[#0F172A] p-4 rounded-lg border border-white/5">
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
                                        <div key={product.id} className="bg-[#0F172A] p-4 rounded-lg border border-white/5 flex items-center gap-4">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded bg-gray-800" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-[10px] text-gray-500">No Img</div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-sm text-white">{product.name}</h3>
                                                <Link href={`/admin/product-support/products/${product.id}`} className="text-xs text-blue-400 hover:text-blue-300">
                                                    Manage Docs &rarr;
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
                    <div className="bg-[#1E293B] rounded-xl border border-white/5 p-6 mb-6">
                        <h3 className="font-bold mb-4 text-white">Activity Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Total Posts</span>
                                <span className="text-white font-medium">-</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Issues Reported</span>
                                <span className="text-white font-medium">-</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
