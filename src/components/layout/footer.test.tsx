import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

describe('footer', () => {
  it('renders the brand and current year', () => {
    render(<Footer />);

    expect(screen.getByText(/salary management/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});
