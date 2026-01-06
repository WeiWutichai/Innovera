import { PrismaClient } from '@prisma/client';

export class UsersService {
    private prisma: PrismaClient;

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || new PrismaClient();
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
