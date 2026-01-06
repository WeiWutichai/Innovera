
"use server";

import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: number, newRole: Role) {
    const session = await auth();

    // Security check: only admins can update roles
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
    });

    revalidatePath("/admin/users");
}
