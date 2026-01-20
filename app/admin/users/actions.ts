
"use server";

import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

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

export async function resetUserPassword(userId: number, newPassword: string) {
    const session = await auth();

    // Security check: only admins can reset passwords
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    if (!newPassword || newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    revalidatePath("/admin/users");
    return { success: true };
}
