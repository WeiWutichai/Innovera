import { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from './prisma';

export class UsersService {
    private prisma: PrismaClient;

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || defaultPrisma;
    }

    async findAll() {
        // Never expose password hashes to callers.
        const users = await this.prisma.user.findMany();
        return users.map(({ password, ...rest }) => rest);
    }

    async create(name: string, email: string) {
        return this.prisma.user.create({
            data: { name, email },
        });
    }
}

export const usersService = new UsersService();
