/**
 * Mock next/server before any imports so the route module loads cleanly
 * in a jsdom environment (which lacks global Request/Response/Headers).
 */
jest.mock('next/server', () => ({
    NextResponse: {
        json: (body: any, init?: { status?: number }) => ({
            status: init?.status ?? 200,
            json: async () => body,
        }),
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password_123'),
}));

jest.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

// Rate limiter is mocked so tests are deterministic (no shared in-memory state)
// and so getClientIp does not need real request headers.
jest.mock('@/lib/rate-limit', () => ({
    rateLimit: jest.fn(() => ({ success: true, remaining: 4, resetAt: 0 })),
    getClientIp: jest.fn(() => '127.0.0.1'),
}));

import { POST } from './route';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';
import { BCRYPT_ROUNDS } from '@/lib/constants';

const mockPrismaUser = prisma.user as any;
const mockRateLimit = rateLimit as jest.Mock;

function makeRequest(body: unknown): Request {
    return {
        json: async () => body,
    } as any;
}

describe('POST /api/register', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockClear();
        mockRateLimit.mockReturnValue({ success: true, remaining: 4, resetAt: 0 });
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    // --- Happy path ---

    it('should register a new user successfully (neutral response, isApproved=false)', async () => {
        mockPrismaUser.findUnique.mockResolvedValue(null);
        mockPrismaUser.create.mockResolvedValue({
            id: 1,
            email: 'new@example.com',
            name: 'New User',
        });

        const res = await POST(makeRequest({
            email: 'new@example.com',
            password: 'securepass',
            name: 'New User',
        }));

        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json.message).toMatch(/Registration received/i);
        // Anti-enumeration: no user object is returned.
        expect(json.user).toBeUndefined();

        expect(hash).toHaveBeenCalledWith('securepass', BCRYPT_ROUNDS);
        expect(mockPrismaUser.create).toHaveBeenCalledWith({
            data: {
                email: 'new@example.com',
                name: 'New User',
                password: 'hashed_password_123',
                isApproved: false,
            },
        });
    });

    it('should register without name (optional field)', async () => {
        mockPrismaUser.findUnique.mockResolvedValue(null);
        mockPrismaUser.create.mockResolvedValue({ id: 2, email: 'noname@example.com' });

        const res = await POST(makeRequest({
            email: 'noname@example.com',
            password: 'securepass',
        }));

        expect(res.status).toBe(201);
    });

    // --- Validation errors ---

    it('should return 400 when email is missing', async () => {
        const res = await POST(makeRequest({ password: 'securepass' }));
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe('Validation failed');
    });

    it('should return 400 when email is invalid', async () => {
        const res = await POST(makeRequest({ email: 'not-an-email', password: 'securepass' }));
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe('Validation failed');
    });

    it('should return 400 when password is missing', async () => {
        const res = await POST(makeRequest({ email: 'test@example.com' }));
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe('Validation failed');
    });

    it('should return 400 when password is too short', async () => {
        const res = await POST(makeRequest({ email: 'test@example.com', password: 'short' }));
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error).toBe('Validation failed');
    });

    // --- Duplicate email (anti-enumeration) ---

    it('should return the SAME neutral 201 when email already exists and NOT create', async () => {
        mockPrismaUser.findUnique.mockResolvedValue({ id: 1 });

        const res = await POST(makeRequest({
            email: 'existing@example.com',
            password: 'securepass',
        }));

        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json.message).toMatch(/Registration received/i);
        expect(mockPrismaUser.create).not.toHaveBeenCalled();
    });

    // --- Rate limiting ---

    it('should return 429 when rate limited', async () => {
        mockRateLimit.mockReturnValue({ success: false, remaining: 0, resetAt: 0 });

        const res = await POST(makeRequest({
            email: 'test@example.com',
            password: 'securepass',
        }));

        expect(res.status).toBe(429);
        expect(mockPrismaUser.create).not.toHaveBeenCalled();
    });

    // --- Internal error ---

    it('should return 500 when prisma throws', async () => {
        mockPrismaUser.findUnique.mockRejectedValue(new Error('DB down'));

        const res = await POST(makeRequest({
            email: 'test@example.com',
            password: 'securepass',
        }));

        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json.error).toBe('Internal server error');
    });
});
