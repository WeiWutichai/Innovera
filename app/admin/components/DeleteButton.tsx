"use client";

import { useTransition } from "react";

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
            className="px-3 py-1 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 text-sm border border-red-500/10 transition-colors disabled:opacity-50"
        >
            {isPending ? "Deleting..." : "Delete"}
        </button>
    );
}
