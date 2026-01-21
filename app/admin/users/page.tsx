import { getPendingUsers, getAllUsers, approveUser, updateUserRole } from "@/app/actions/admin";
import { getProducts } from "@/app/actions/product";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { Users, ChevronRight } from "lucide-react";

import UserRoleSelector from "./UserRoleSelector";

export default async function AdminUsersPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        redirect('/');
    }

    const allUsers = await getAllUsers();
    const totalUsers = allUsers.length;

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">User Management</h1>
                    <p className="text-gray-500">Manage access and roles for all registered users.</p>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-medium shadow-lg shadow-indigo-500/25">
                    Total Users: {totalUsers}
                </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-200">
                        <tr>
                            <th className="p-5">User</th>
                            <th className="p-5">Email</th>
                            <th className="p-5">Role</th>
                            <th className="p-5">Products</th>
                            <th className="p-5 text-right">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {allUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-lg overflow-hidden">
                                        {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-900">{user.name || 'N/A'}</span>
                                </td>
                                <td className="p-5 text-gray-600">{user.email}</td>
                                <td className="p-5">
                                    <UserRoleSelector userId={user.id} currentRole={user.role} />
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${user.products && user.products.length > 0 ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-500'}`}>
                                            {user.products ? user.products.length : 0} Products
                                        </span>
                                    </div>
                                </td>
                                <td className="p-5 text-right">
                                    <Link href={`/admin/users/${user.id}`} className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                        <span>Manage</span>
                                        <ChevronRight className="w-4 h-4" />
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
