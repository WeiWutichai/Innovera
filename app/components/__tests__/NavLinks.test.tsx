import React from 'react';
import { render, screen } from '@testing-library/react';
import NavLinks from '../NavLinks';

describe('NavLinks Component', () => {
    it('renders the Service link with correct href', () => {
        render(<NavLinks />);
        const serviceLink = screen.getByRole('link', { name: /service/i });
        expect(serviceLink).toBeInTheDocument();
        expect(serviceLink).toHaveAttribute('href', '/#insights');
    });

    it('renders other navigation links', () => {
        render(<NavLinks />);
        expect(screen.getByRole('link', { name: /platforms/i })).toHaveAttribute('href', '/#platforms');
        expect(screen.getByRole('link', { name: /site reference/i })).toHaveAttribute('href', '/#site-reference');
        expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog');
        expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute('href', '/#contact');
    });
});
