import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsContent from '../StatsContent';

describe('StatsContent Component', () => {
    it('renders the Custom Software Development card', () => {
        render(<StatsContent />);
        expect(screen.getByText('Custom Software Development')).toBeInTheDocument();
        expect(screen.getByText(/We don't just write code/i)).toBeInTheDocument();
    });

    it('renders the Backlog grooming card', () => {
        render(<StatsContent />);
        expect(screen.getByText('Backlog grooming')).toBeInTheDocument();
        expect(screen.getByText(/Reduce carryover by 32%/i)).toBeInTheDocument();
    });

    it('renders the Branch previews card', () => {
        render(<StatsContent />);
        expect(screen.getByText('Branch previews')).toBeInTheDocument();
    });

    it('renders the Release train card', () => {
        render(<StatsContent />);
        expect(screen.getByText('Release train')).toBeInTheDocument();
        expect(screen.getByText(/0 incidents/i)).toBeInTheDocument();
        // Check for the "this week" text which is on a new line in the same element
        expect(screen.getByText(/0 incidents/i)).toHaveTextContent('this week');
    });

    it('renders the bottom stats using StatItem', () => {
        render(<StatsContent />);
        // Check titles
        expect(screen.getByText('Lead time')).toBeInTheDocument();
        expect(screen.getByText('On-time delivery')).toBeInTheDocument();
        expect(screen.getByText('Cycle time')).toBeInTheDocument();
        expect(screen.getByText('NPS')).toBeInTheDocument();

        // Check values
        expect(screen.getByText('2.1d')).toBeInTheDocument();
        expect(screen.getByText('96%')).toBeInTheDocument();
        expect(screen.getByText('7.4h')).toBeInTheDocument();
        expect(screen.getByText('72')).toBeInTheDocument();
    });
});
