jest.mock('next/server', () => ({
    NextResponse: {
        json: (body: any, init?: { status?: number }) => ({
            status: init?.status ?? 200,
            json: async () => body,
        }),
    },
}));

jest.mock('@/auth', () => ({
    auth: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn().mockResolvedValue('new_hashed_password'),
}));

jest.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

import { POST } from './route';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

const mockAuth = auth as jest.Mock;
const mockPrismaUser = prisma.user as any;
const mockCompare = compare as jest.MockedFunction<typeof compare>;

function makeRequest(body: unknown): Request {
    return { json: async () => body } as any;
}

const DB_USER = {
    id: 1,
    email: 'user@example.com',
    name: 'Old Name',
    password: 'existing_hashed_password',
    image: null,
};

const OAUTH_USER = {
    id: 2,
    email: 'oauth@example.com',
    name: 'OAuth User',
    password: null,
    image: null,
};

describe('POST /api/user/update', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockClear();
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    // --- Unauthorized ---

    it('should return 401 when session is missing', async () => {
        mockAuth.mockResolvedValue(null as any);

        const res = await POST(makeRequest({ name: 'New Name' }));

        expect(res.status).toBe(401);
        const json = await res.json();
        expect(json.error).toBe('Unauthorized');
    });

    it('should return 401 when session has no email', async () => {
        mockAuth.mockResolvedValue({ user: {} } as any);

        const res = await POST(makeRequest({ name: 'New Name' }));

        expect(res.status).toBe(401);
    });

    // --- User not found ---

    it('should return 404 when user not found in DB', async () => {
        mockAuth.mockResolvedValue({ user: { email: 'ghost@example.com' } } as any);
        mockPrismaUser.findUnique.mockResolvedValue(null);

        const res = await POST(makeRequest({ name: 'New Name' }));

        expect(res.status).toBe(404);
        const json = await res.json();
        expect(json.error).toBe('User not found');
    });

    // --- Name update ---

    it('should update name successfully', async () => {
        mockAuth.mockResolvedValue({ user: { email: DB_USER.email } } as any);
        mockPrismaUser.findUnique.mockResolvedValue(DB_USER);
        mockPrismaUser.update.mockResolvedValue({ ...DB_USER, name: 'New Name' });

        const res = await POST(makeRequest({ name: 'New Name' }));

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.message).toBe('Profile updated successfully');
        expect(mockPrismaUser.update).toHaveBeenCalledWith({
            where: { email: DB_USER.email },
            data: { name: 'New Name' },
        });
    });

    it('should return "No changes made" when name is same as current', async () => {
        mockAuth.mockResolvedValue({ user: { email: DB_USER.email } } as any);
        mockPrismaUser.findUnique.mockResolvedValue(DB_USER);

        const res = await POST(makeRequest({ name: DB_USER.name }));

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.message).toBe('No changes made');
        expect(mockPrismaUser.update).not.toHaveBeenCalled();
    });

    // --- Password change ---

    it('should change password when old password is correct', async () => {
        mockAuth.mockResolvedValue({ user: { email: DB_USER.email } } as any);
        mockPrismaUser.findUnique.mockResolvedValue(DB_USER);
        mockCompare.mockResolvedValue(true as never);
        mockPrismaUser.update.mockResolvedValue({});

        const res = await POST(makeRequest({
            oldPassword: 'correctOldPass',
            newPassword: 'brandNewPass',
        }));

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.message).toBe('Profile updated successfully');
        expect(mockCompare).toHaveBeenCalledWith('correctOldPass', DB_USER.password);
        expect(mockPrismaUser.update).toHaveBeenCalledWith({
            where: { email: DB_USER.email },
            data: { password: 'new_hashed_password' },
        });
    });

    it('should return 400 when old password is incorrect', async () => {
        mockAuth.mockResolvedValue({ user: { email: DB_USER.email } } as any);
        mockPrismaUser.findUnique.mockResolvedValue(DB_USER);
        mockCompare.mockResolvedValue(false as never);

        const res = await POST(makeRequest({
            oldPassword: 'wrongPass',
            newPassword: 'brandNewPass',
        }));

        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe('Incorrect current password');
        expect(mockPrismaUser.update).not.toHaveBeenCalled();
    });

    it('should return 400 when newPassword provided without oldPassword', async () => {
        mockAuth.mockResolvedValue({ user: { email: DB_USER.email } } as any);
        mockPrismaUser.findUnique.mockResolvedValue(DB_USER);

        const res = await POST(makeRequest({
            newPassword: 'brandNewPass',
        }));

        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe('Current password required');
    });

    it('should return 400 when newPassword is too short (below policy)', async () => {
        mockAuth.mockResolvedValue({ user: { email: DB_USER.email } } as any);
        mockPrismaUser.findUnique.mockResolvedValue(DB_USER);

        const res = await POST(makeRequest({
            oldPassword: 'correctOldPass',
            newPassword: 'short',
        }));

        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe('Password must be at least 8 characters');
        // Weak password is rejected before verifying the old password or updating.
        expect(mockCompare).not.toHaveBeenCalled();
        expect(mockPrismaUser.update).not.toHaveBeenCalled();
    });

    // --- OAuth user cannot change password ---

    it('should return 400 when OAuth user tries to change password', async () => {
        mockAuth.mockResolvedValue({ user: { email: OAUTH_USER.email } } as any);
        mockPrismaUser.findUnique.mockResolvedValue(OAUTH_USER);

        const res = await POST(makeRequest({
            oldPassword: 'anything',
            newPassword: 'brandNewPass',
        }));

        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe('User uses OAuth, cannot change password');
    });

    // --- Combined update (name + password) ---

    it('should update both name and password in one request', async () => {
        mockAuth.mockResolvedValue({ user: { email: DB_USER.email } } as any);
        mockPrismaUser.findUnique.mockResolvedValue(DB_USER);
        mockCompare.mockResolvedValue(true as never);
        mockPrismaUser.update.mockResolvedValue({});

        const res = await POST(makeRequest({
            name: 'Updated Name',
            oldPassword: 'correctOldPass',
            newPassword: 'brandNewPass',
        }));

        expect(res.status).toBe(200);
        expect(mockPrismaUser.update).toHaveBeenCalledWith({
            where: { email: DB_USER.email },
            data: {
                name: 'Updated Name',
                password: 'new_hashed_password',
            },
        });
    });

    // --- Internal error ---

    it('should return 500 when prisma throws', async () => {
        mockAuth.mockResolvedValue({ user: { email: DB_USER.email } } as any);
        mockPrismaUser.findUnique.mockRejectedValue(new Error('DB down'));

        const res = await POST(makeRequest({ name: 'Test' }));

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json.error).toBe('Internal server error');
    });
});
