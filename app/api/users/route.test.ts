jest.mock('next/server', () => ({
    NextResponse: {
        json: (body: any, init?: { status?: number }) => ({
            status: init?.status ?? 200,
            json: async () => body,
        }),
    },
}));

const mockAuth = jest.fn();
jest.mock('@/auth', () => ({ auth: (...args: any[]) => mockAuth(...args) }));

jest.mock('@/lib/users.service', () => {
    const mockService = {
        findAll: jest.fn(),
        create: jest.fn(),
    };
    return {
        UsersService: jest.fn(() => mockService),
        usersService: mockService,
    };
});

import { GET, POST } from './route';
import { usersService } from '@/lib/users.service';

const mockUsersService = usersService as jest.Mocked<typeof usersService>;

function makePostRequest(body: unknown): Request {
    return { json: async () => body } as any;
}

const adminSession = { user: { id: '1', email: 'admin@test.com', role: 'ADMIN' } };

describe('GET /api/users', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAuth.mockResolvedValue(adminSession);
    });

    it('should return 401 when not authenticated', async () => {
        mockAuth.mockResolvedValue(null);
        const res = await GET();
        expect(res.status).toBe(401);
    });

    it('should return 401 when not admin', async () => {
        mockAuth.mockResolvedValue({ user: { id: '2', role: 'USER' } });
        const res = await GET();
        expect(res.status).toBe(401);
    });

    it('should return all users without password field', async () => {
        const users = [
            { id: 1, name: 'Alice', email: 'alice@example.com', password: 'hashed1' },
            { id: 2, name: 'Bob', email: 'bob@example.com', password: 'hashed2' },
        ];
        mockUsersService.findAll.mockResolvedValue(users as any);

        const res = await GET();

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual([
            { id: 1, name: 'Alice', email: 'alice@example.com' },
            { id: 2, name: 'Bob', email: 'bob@example.com' },
        ]);
        expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users exist', async () => {
        mockUsersService.findAll.mockResolvedValue([]);

        const res = await GET();

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json).toEqual([]);
    });

    it('should return 500 when service throws', async () => {
        mockUsersService.findAll.mockRejectedValue(new Error('DB error'));

        const res = await GET();

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json.error).toBe('Failed to fetch users');
    });
});

describe('POST /api/users', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAuth.mockResolvedValue(adminSession);
    });

    it('should return 401 when not admin', async () => {
        mockAuth.mockResolvedValue(null);
        const res = await POST(makePostRequest({ name: 'Test', email: 'test@test.com' }));
        expect(res.status).toBe(401);
    });

    it('should create a user and return 201', async () => {
        const newUser = { id: 3, name: 'Charlie', email: 'charlie@example.com' };
        mockUsersService.create.mockResolvedValue(newUser as any);

        const res = await POST(makePostRequest({
            name: 'Charlie',
            email: 'charlie@example.com',
        }));

        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json).toEqual(newUser);
        expect(mockUsersService.create).toHaveBeenCalledWith('Charlie', 'charlie@example.com');
    });

    it('should return 500 when service throws', async () => {
        mockUsersService.create.mockRejectedValue(new Error('Unique constraint'));

        const res = await POST(makePostRequest({
            name: 'Charlie',
            email: 'charlie@example.com',
        }));

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json.error).toBe('Failed to create user');
    });
});
