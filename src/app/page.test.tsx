import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('home page', () => {
  it('shows the salary management heading', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: /salary management/i, level: 1 }),
    ).toBeInTheDocument();
  });
});
