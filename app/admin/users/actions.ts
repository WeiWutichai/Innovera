
"use server";

import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth-helpers";
import { passwordSchema } from "@/lib/validation";
import { BCRYPT_ROUNDS } from "@/lib/constants";

export async function updateUserRole(userId: number, newRole: Role) {
    // Security check: only admins can update roles
    await requireAdmin();

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
    });

    revalidatePath("/admin/users");
}

export async function resetUserPassword(userId: number, newPassword: string) {
    // Security check: only admins can reset passwords
    await requireAdmin();

    const parsed = passwordSchema.safeParse(newPassword);
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0].message);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(parsed.data, BCRYPT_ROUNDS);

    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    revalidatePath("/admin/users");
    return { success: true };
}
