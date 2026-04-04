import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { usersService } from '@/lib/users.service';

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await usersService.findAll();
        const safeUsers = users.map(({ password, ...rest }: any) => rest);
        return NextResponse.json(safeUsers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const user = await usersService.create(body.name, body.email);
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
