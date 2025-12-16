import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
            },
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
