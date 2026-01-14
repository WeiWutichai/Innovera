import { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from './prisma';

export class UsersService {
    private prisma: PrismaClient;

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || defaultPrisma;
    }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async create(name: string, email: string) {
        return this.prisma.user.create({
            data: { name, email },
        });
    }
}

export const usersService = new UsersService();
