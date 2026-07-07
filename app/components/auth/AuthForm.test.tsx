
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from './AuthForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(() => ({
        get: jest.fn(() => null),
    })),
}));

// Mock SocialButton since it uses SVGs that might need transformation or just to simplify
jest.mock('./SocialButton', () => {
    return function DummySocialButton({ children }: { children: React.ReactNode }) {
        return <button>{children}</button>;
    };
});

describe('AuthForm', () => {
    const mockSignIn = signIn as jest.Mock;
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
            refresh: mockRefresh,
        });
    });

    it('renders login form correctly', () => {
        render(<AuthForm type="login" />);

        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('calls signIn with credentials on submit', async () => {
        mockSignIn.mockResolvedValue({ error: null });

        render(<AuthForm type="login" />);

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('credentials', {
                redirect: false,
                email: 'test@example.com',
                password: 'password123',
            });
        });

        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('displays error message on failed login', async () => {
        mockSignIn.mockResolvedValue({ error: 'Invalid credentials' });

        render(<AuthForm type="login" />);

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
        });
    });

    it('displays service error message for auth configuration failures', async () => {
        mockSignIn.mockResolvedValue({ error: 'Configuration' });

        render(<AuthForm type="login" />);

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/unable to sign in right now/i)).toBeInTheDocument();
        });
    });

    it('displays approval message for access denied errors', async () => {
        mockSignIn.mockResolvedValue({ error: 'AccessDenied' });

        render(<AuthForm type="login" />);

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'pending@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/pending approval/i)).toBeInTheDocument();
        });
    });
});
