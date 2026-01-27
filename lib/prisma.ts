
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
// Last updated: 2026-01-27T15:38:00 - Added LineUser model
