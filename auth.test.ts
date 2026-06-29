/**
 * Tests for NextAuth callbacks and authorize function.
 *
 * auth.ts exports the result of calling NextAuth(). We mock NextAuth to capture
 * the merged config (auth.config.ts + the Node-only Credentials provider and
 * jwt/signIn callbacks), then test each callback directly.
 */

// Mock prisma before any imports
jest.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    // auth.ts precomputes a DUMMY_HASH at module load via hash()
    hash: jest.fn().mockResolvedValue('dummy_hash'),
}));

// Capture the config passed to NextAuth
let capturedConfig: any = null;

jest.mock('next-auth', () => {
    return function NextAuth(config: any) {
        capturedConfig = config;
        return {
            handlers: {},
            signIn: jest.fn(),
            signOut: jest.fn(),
            auth: jest.fn(),
        };
    };
});

jest.mock('next-auth/providers/credentials', () => {
    return function Credentials(opts: any) {
        return { id: 'credentials', ...opts };
    };
});

jest.mock('next-auth/providers/google', () => {
    return function Google(opts: any) {
        return { id: 'google', ...opts };
    };
});

import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

const mockPrismaUser = prisma.user as any;
const mockCompare = compare as jest.MockedFunction<typeof compare>;

// Force module to load so capturedConfig is populated
beforeAll(async () => {
    await import('./auth');
});

// Helper to get the credentials provider's authorize function
function getAuthorize(): (credentials: any, request?: any) => Promise<any> {
    const credProvider = capturedConfig.providers.find(
        (p: any) => p.id === 'credentials'
    );
    return credProvider.authorize;
}

describe('Credentials authorize', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return null when email is missing', async () => {
        const authorize = getAuthorize();
        const result = await authorize({ password: 'pass123' });
        expect(result).toBeNull();
    });

    it('should return null when password is missing', async () => {
        const authorize = getAuthorize();
        const result = await authorize({ email: 'test@example.com' });
        expect(result).toBeNull();
    });

    it('should return null when user is not found (and still runs a dummy compare)', async () => {
        mockPrismaUser.findUnique.mockResolvedValue(null);

        const authorize = getAuthorize();
        const result = await authorize({
            email: 'nonexistent@example.com',
            password: 'pass123',
        });

        expect(result).toBeNull();
        // timing-equalizer dummy compare
        expect(mockCompare).toHaveBeenCalled();
    });

    it('should return null when user has no password (OAuth user)', async () => {
        mockPrismaUser.findUnique.mockResolvedValue({
            id: 1,
            email: 'oauth@example.com',
            password: null,
        });

        const authorize = getAuthorize();
        const result = await authorize({
            email: 'oauth@example.com',
            password: 'pass123',
        });

        expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
        mockPrismaUser.findUnique.mockResolvedValue({
            id: 1,
            email: 'user@example.com',
            password: 'hashed',
        });
        mockCompare.mockResolvedValue(false as never);

        const authorize = getAuthorize();
        const result = await authorize({
            email: 'user@example.com',
            password: 'wrongpass',
        });

        expect(result).toBeNull();
        expect(mockCompare).toHaveBeenCalledWith('wrongpass', 'hashed');
    });

    it('should return user object when credentials are valid', async () => {
        const dbUser = {
            id: 42,
            email: 'valid@example.com',
            name: 'Valid User',
            image: 'https://img.example.com/avatar.png',
            password: 'hashed_pw',
            role: 'USER',
            isApproved: true,
            canReportIssues: false,
        };
        mockPrismaUser.findUnique.mockResolvedValue(dbUser);
        mockCompare.mockResolvedValue(true as never);

        const authorize = getAuthorize();
        const result = await authorize({
            email: 'valid@example.com',
            password: 'correctpass',
        });

        expect(result).toEqual({
            id: '42',
            email: 'valid@example.com',
            name: 'Valid User',
            image: 'https://img.example.com/avatar.png',
            role: 'USER',
            isApproved: true,
            canReportIssues: false,
        });
    });
});

describe('jwt callback', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const jwtCallback = () => capturedConfig.callbacks.jwt;

    it('refreshes claims from DB on subsequent requests (token not a frozen snapshot)', async () => {
        // DB lookup by id returns the CURRENT claims, overriding stale token values.
        mockPrismaUser.findUnique.mockResolvedValue({
            role: 'ADMIN',
            isApproved: true,
            canReportIssues: false,
        });

        const token = { id: '1', role: 'USER', sub: 'abc' };
        const result = await jwtCallback()({ token, user: undefined, account: undefined });

        expect(result.id).toBe('1');
        expect(result.role).toBe('ADMIN');
        expect(result.isApproved).toBe(true);
        expect(result.canReportIssues).toBe(false);
        expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            select: { role: true, isApproved: true, canReportIssues: true },
        });
    });

    it('invalidates the session (returns null) when the user no longer exists', async () => {
        mockPrismaUser.findUnique.mockResolvedValue(null);

        const token = { id: '99' };
        const result = await jwtCallback()({ token, user: undefined, account: undefined });

        expect(result).toBeNull();
    });

    it('sets token.id and refreshes claims on credentials sign-in', async () => {
        mockPrismaUser.findUnique.mockResolvedValue({
            role: 'ADMIN',
            isApproved: true,
            canReportIssues: true,
        });

        const token = { sub: 'abc' } as any;
        const user = { id: '10' };
        const account = { provider: 'credentials' };

        const result = await jwtCallback()({ token, user, account });

        expect(result.id).toBe('10');
        expect(result.role).toBe('ADMIN');
        expect(result.isApproved).toBe(true);
        expect(result.canReportIssues).toBe(true);
    });

    it('resolves the DB id for Google sign-in (not the OAuth profile id) then refreshes claims', async () => {
        // First call: lookup by email -> DB id; second call: lookup by id -> claims.
        mockPrismaUser.findUnique
            .mockResolvedValueOnce({ id: 42 })
            .mockResolvedValueOnce({ role: 'USER', isApproved: true, canReportIssues: false });

        const token = {} as any;
        const user = { id: 'google-oauth-id', email: 'existing@gmail.com' };
        const account = { provider: 'google' };

        const result = await jwtCallback()({ token, user, account });

        // token.id must be the DB id, NOT the Google OAuth id
        expect(result.id).toBe('42');
        expect(result.role).toBe('USER');
        expect(result.isApproved).toBe(true);
    });
});

describe('session callback', () => {
    const sessionCallback = () => capturedConfig.callbacks.session;

    it('should enrich session.user from token', async () => {
        const session = { user: {} } as any;
        const token = { id: 42, role: 'ADMIN', isApproved: true, canReportIssues: false };

        const result = await sessionCallback()({ session, token });

        expect(result.user.id).toBe('42');
        expect(result.user.role).toBe('ADMIN');
        expect(result.user.isApproved).toBe(true);
        expect(result.user.canReportIssues).toBe(false);
    });

    it('should return session unchanged when token has no id', async () => {
        const session = { user: { name: 'Test' } } as any;
        const token = {};

        const result = await sessionCallback()({ session, token });

        expect(result.user.id).toBeUndefined();
        expect(result.user.name).toBe('Test');
    });
});

describe('signIn callback', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const signInCallback = () => capturedConfig.callbacks.signIn;

    it('should allow approved credentials user', async () => {
        mockPrismaUser.findUnique.mockResolvedValue({ id: 1, email: 'user@test.com', role: 'USER', isApproved: true });

        const result = await signInCallback()({
            user: { id: '1', email: 'user@test.com' },
            account: { provider: 'credentials' },
        });
        expect(result).toBe(true);
    });

    it('should block unapproved credentials user', async () => {
        mockPrismaUser.findUnique.mockResolvedValue({ id: 1, email: 'user@test.com', role: 'USER', isApproved: false });

        const result = await signInCallback()({
            user: { id: '1', email: 'user@test.com' },
            account: { provider: 'credentials' },
        });
        expect(result).toBe(false);
    });

    it('should always allow admin sign-in even if not approved', async () => {
        mockPrismaUser.findUnique.mockResolvedValue({ id: 1, email: 'admin@test.com', role: 'ADMIN', isApproved: false });

        const result = await signInCallback()({
            user: { id: '1', email: 'admin@test.com' },
            account: { provider: 'credentials' },
        });
        expect(result).toBe(true);
    });

    it('should allow Google sign-in for existing approved user', async () => {
        mockPrismaUser.findUnique.mockResolvedValue({ id: 1, email: 'g@gmail.com', role: 'USER', isApproved: true });

        const result = await signInCallback()({
            user: { email: 'g@gmail.com' },
            account: { provider: 'google' },
        });

        expect(result).toBe(true);
        expect(mockPrismaUser.create).not.toHaveBeenCalled();
    });

    it('should CREATE a new Google user (unapproved) and block until approval', async () => {
        mockPrismaUser.findUnique.mockResolvedValue(null);
        mockPrismaUser.create.mockResolvedValue({ id: 7 });

        const result = await signInCallback()({
            user: { email: 'brand-new@gmail.com', name: 'New', image: null },
            account: {
                provider: 'google',
                type: 'oauth',
                providerAccountId: 'goog-123',
                access_token: 'at',
                token_type: 'bearer',
                scope: 'openid',
                id_token: 'idt',
            },
        });

        expect(mockPrismaUser.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                email: 'brand-new@gmail.com',
                isApproved: false,
                accounts: {
                    create: expect.objectContaining({
                        provider: 'google',
                        providerAccountId: 'goog-123',
                    }),
                },
            }),
        });
        expect(result).toBe(false);
    });

    it('should return true when there is no account (e.g. session refresh)', async () => {
        const result = await signInCallback()({
            user: { id: '1' },
            account: null,
        });

        expect(result).toBe(true);
    });
});
