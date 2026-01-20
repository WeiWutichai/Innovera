import { getPendingUsers, getAllUsers, approveUser, updateUserRole } from "@/app/actions/admin";
import { getProducts } from "@/app/actions/product";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import UserRoleSelector from "./UserRoleSelector";

export default async function AdminUsersPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const allUsers = await getAllUsers();
    const totalUsers = allUsers.length;

    return (
        <div className="container mx-auto px-6 py-8 text-white">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-gray-400">Manage access and roles for all registered users.</p>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 text-rose-400 font-medium">
                    Total Users: {totalUsers}
                </div>
            </div>

            <div className="bg-[#1E293B] rounded-xl overflow-hidden shadow-xl border border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-[#0F172A] text-gray-400 text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="p-6">User</th>
                            <th className="p-6">Email</th>
                            <th className="p-6">Role</th>
                            <th className="p-6">Products</th>
                            <th className="p-6 text-right">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {allUsers.map(user => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg overflow-hidden">
                                        {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="font-medium text-white">{user.name || 'N/A'}</span>
                                </td>
                                <td className="p-6 text-gray-300">{user.email}</td>
                                <td className="p-6">
                                    <UserRoleSelector userId={user.id} currentRole={user.role} />
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${user.products && user.products.length > 0 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                                            {user.products ? user.products.length : 0} Products
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <Link href={`/admin/users/${user.id}`} className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                                        <span>Manage</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
