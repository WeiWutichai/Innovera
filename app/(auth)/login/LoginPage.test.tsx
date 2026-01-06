
import { render, screen } from '@testing-library/react';
import LoginPage from './page';

// Mock child components
jest.mock('@/app/components/auth/AuthForm', () => {
    return function DummyAuthForm() {
        return <div data-testid="auth-form">Mock Auth Form</div>;
    };
});

describe('LoginPage', () => {
    it('renders welcome message', () => {
        render(<LoginPage />);
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
        expect(screen.getByText(/access your account/i)).toBeInTheDocument();
    });

    it('renders AuthForm', () => {
        render(<LoginPage />);
        expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    });

    it('renders create account link', () => {
        render(<LoginPage />);
        const link = screen.getByRole('link', { name: /create account/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/register');
    });
});
