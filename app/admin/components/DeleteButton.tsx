"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
    action: (id: string) => Promise<void>;
    id: string;
    itemName?: string;
}

export default function DeleteButton({ action, id, itemName = "item" }: DeleteButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete this ${itemName}?`)) {
            startTransition(async () => {
                await action(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm border border-red-100 transition-colors disabled:opacity-50 flex items-center gap-1.5 font-medium"
        >
            <Trash2 className="w-4 h-4" />
            {isPending ? "Deleting..." : "Delete"}
        </button>
    );
}
