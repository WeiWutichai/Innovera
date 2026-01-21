'use client';

import { Role } from "@prisma/client";
import { updateUserRole } from "@/app/actions/admin";
import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";

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

    const getRoleStyles = () => {
        switch (role) {
            case 'OWNER':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'ADMIN':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="relative inline-block">
            <select
                value={role}
                onChange={handleChange}
                disabled={isPending}
                className={`appearance-none font-medium rounded-lg pl-4 pr-10 py-2 border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors uppercase tracking-wider text-xs cursor-pointer ${getRoleStyles()} ${isPending ? 'opacity-50' : ''}`}
            >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="OWNER">OWNER</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
    );
}
