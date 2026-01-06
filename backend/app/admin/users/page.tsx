
import { prisma } from "@/lib/prisma";
import UserList from "./UserList";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { id: "asc" },
    });

    return (
        <div className="min-h-screen bg-[#050505] p-8 font-nunito">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
                        <p className="text-gray-400">
                            Manage access and roles for all registered users.
                        </p>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium">
                        Total Users: {users.length}
                    </div>
                </div>

                <UserList users={users as any[]} />
            </div>
        </div>
    );
}
