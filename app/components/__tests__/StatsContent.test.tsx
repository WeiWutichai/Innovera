import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsContent from '../StatsContent';

describe('StatsContent Component', () => {
    it('renders the Custom Software Development card', () => {
        render(<StatsContent />);
        expect(screen.getByText('Custom Software Development')).toBeInTheDocument();
        expect(screen.getByText(/Tailored to your needs/i)).toBeInTheDocument();
    });

    it('renders the Backlog grooming card', () => {
        render(<StatsContent />);
        expect(screen.getByText('Backlog grooming')).toBeInTheDocument();
        expect(screen.getByText(/Keep it clean/i)).toBeInTheDocument();
    });

    it('renders the Branch previews card', () => {
        render(<StatsContent />);
        expect(screen.getByText('Branch previews')).toBeInTheDocument();
        expect(screen.getByText(/Deploy every branch/i)).toBeInTheDocument();
    });

    it('renders the Release train card', () => {
        render(<StatsContent />);
        expect(screen.getByText('Release train')).toBeInTheDocument();
        expect(screen.getByText(/v2.4/i)).toBeInTheDocument();
        expect(screen.getByText(/shipped/i)).toBeInTheDocument();
    });

    it('renders the bottom stats using StatItem', () => {
        render(<StatsContent />);
        // Check titles
        expect(screen.getByText('Lead time')).toBeInTheDocument();
        expect(screen.getByText('On time')).toBeInTheDocument();
        expect(screen.getByText('Cycle time')).toBeInTheDocument();
        expect(screen.getByText('NPS')).toBeInTheDocument();

        // Check values
        expect(screen.getByText('2.1d')).toBeInTheDocument();
        expect(screen.getByText('96%')).toBeInTheDocument();
        expect(screen.getByText('7.4h')).toBeInTheDocument();
        expect(screen.getByText('72')).toBeInTheDocument();
    });
});
