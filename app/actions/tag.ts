'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser, requireAdmin } from "@/lib/auth-helpers";
import { tagCreateSchema } from "@/lib/validation";

// Any authenticated user can read the tag catalogue (needed to pick tags when
// reporting an issue and to render tag filters).
export async function getTags() {
    await requireUser();
    return await prisma.tag.findMany({
        select: { id: true, name: true, color: true },
        orderBy: { name: 'asc' },
    });
}

// ADMIN-only: add a new tag to the shared catalogue.
export async function createTag(data: { name: string; color?: string }) {
    await requireAdmin();

    const parsed = tagCreateSchema.parse(data);
    const name = parsed.name.trim();
    if (!name) throw new Error("Tag name is required");

    // Case-insensitive uniqueness so "Bug" and "bug" don't both exist. This is
    // a best-effort pre-check for a friendly message; the case-SENSITIVE DB
    // unique index is the real guard, so the create is wrapped to translate a
    // P2002 (lost race / exact-name double-submit) into the same friendly error.
    const existing = await prisma.tag.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
        select: { id: true },
    });
    if (existing) throw new Error("A tag with this name already exists");

    let tag;
    try {
        tag = await prisma.tag.create({
            data: { name, color: parsed.color || 'slate' },
            select: { id: true, name: true, color: true },
        });
    } catch (err: any) {
        if (err?.code === 'P2002') {
            throw new Error("A tag with this name already exists");
        }
        throw err;
    }

    revalidatePath('/community/issues');
    return tag;
}

// ADMIN-only: remove a tag from the catalogue. The implicit M2M rows are
// removed by the ON DELETE CASCADE on _IssueTags, so issues simply lose the tag.
export async function deleteTag(id: string) {
    await requireAdmin();

    await prisma.tag.delete({ where: { id } });

    revalidatePath('/community/issues');
    return { success: true };
}
