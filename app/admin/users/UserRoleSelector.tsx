'use client';

import { Role } from "@prisma/client";
import { updateUserRole } from "@/app/actions/admin";
import { useState, useTransition } from "react";

interface UserRoleSelectorProps {
    userId: number;
    currentRole: Role;
}

export default function UserRoleSelector({ userId, currentRole }: UserRoleSelectorProps) {
    const [role, setRole] = useState<Role>(currentRole);
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as Role;
        setRole(newRole);

        startTransition(async () => {
            try {
                // We default canReportIssues to true as per previous changes
                await updateUserRole(userId, newRole, true);
            } catch (error) {
                console.error("Failed to update role", error);
                // Revert on error if needed, or show toast
            }
        });
    };

    return (
        <div className="relative inline-block">
            <select
                value={role}
                onChange={handleChange}
                disabled={isPending}
                className={`appearance-none bg-black text-white font-bold rounded-lg pl-4 pr-10 py-2 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors uppercase tracking-wider text-sm cursor-pointer ${isPending ? 'opacity-50' : ''}`}
            >
                <option value="USER" className="bg-[#1E1E2D] text-gray-300">USER</option>
                <option value="ADMIN" className="bg-[#1E1E2D] text-white">ADMIN</option>
                <option value="OWNER" className="bg-[#1E1E2D] text-emerald-400">OWNER</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/50">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
}
