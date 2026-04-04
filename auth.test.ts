/**
 * Tests for NextAuth callbacks and authorize function.
 *
 * The auth.ts file exports the result of calling NextAuth(), which makes it
 * difficult to test callbacks in isolation. Instead, we extract the callback
 * logic by re-importing the module config. Since NextAuth is called at module
 * level, we mock the NextAuth function itself to capture the config, then
 * test each callback directly.
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
function getAuthorize(): (credentials: any) => Promise<any> {
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

    it('should return null when user is not found', async () => {
        mockPrismaUser.findUnique.mockResolvedValue(null);

        const authorize = getAuthorize();
        const result = await authorize({
            email: 'nonexistent@example.com',
            password: 'pass123',
        });

        expect(result).toBeNull();
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

    it('should return token unchanged when no account/user (subsequent requests)', async () => {
        const token = { id: '1', role: 'USER', sub: 'abc' };
        const result = await jwtCallback()({ token, user: undefined, account: undefined });
        expect(result).toEqual(token);
    });

    it('should enrich token with credentials user fields on initial sign-in', async () => {
        const token = { sub: 'abc' } as any;
        const user = {
            id: '10',
            role: 'ADMIN',
            isApproved: true,
            canReportIssues: true,
        };
        const account = { provider: 'credentials' };

        const result = await jwtCallback()({ token, user, account });

        expect(result.id).toBe('10');
        expect(result.role).toBe('ADMIN');
        expect(result.isApproved).toBe(true);
        expect(result.canReportIssues).toBe(true);
    });

    it('should create new user in DB for first Google sign-in', async () => {
        mockPrismaUser.findUnique.mockResolvedValue(null);
        mockPrismaUser.create.mockResolvedValue({});

        const token = {} as any;
        const user = {
            id: 'google-id',
            email: 'new@gmail.com',
            name: 'New Google',
            image: 'https://img.com/pic.jpg',
        };
        const account = {
            provider: 'google',
            type: 'oauth',
            providerAccountId: 'goog-123',
            access_token: 'at',
            token_type: 'bearer',
            scope: 'openid',
            id_token: 'idt',
        };

        const result = await jwtCallback()({ token, user, account });

        expect(mockPrismaUser.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                email: 'new@gmail.com',
                name: 'New Google',
                accounts: {
                    create: expect.objectContaining({
                        provider: 'google',
                        providerAccountId: 'goog-123',
                    }),
                },
            }),
        });
        expect(result.role).toBe('USER');
        expect(result.isApproved).toBe(false);
        expect(result.canReportIssues).toBe(false);
    });

    it('should use existing DB user fields for returning Google user', async () => {
        mockPrismaUser.findUnique.mockResolvedValue({
            role: 'ADMIN',
            isApproved: true,
            canReportIssues: true,
        });

        const token = {} as any;
        const user = { id: 'google-id', email: 'existing@gmail.com' };
        const account = { provider: 'google' };

        const result = await jwtCallback()({ token, user, account });

        expect(result.role).toBe('ADMIN');
        expect(result.isApproved).toBe(true);
        expect(result.canReportIssues).toBe(true);
        expect(mockPrismaUser.create).not.toHaveBeenCalled();
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
    });

    it('should block Google sign-in for new user (needs approval)', async () => {
        mockPrismaUser.findUnique.mockResolvedValue(null);

        const result = await signInCallback()({
            user: { email: 'brand-new@gmail.com' },
            account: { provider: 'google' },
        });

        expect(result).toBe(false);
    });

    it('should return true when user has no email', async () => {
        const result = await signInCallback()({
            user: { id: '1' },
            account: null,
        });

        expect(result).toBe(true);
    });
});
