import { render, screen } from '@testing-library/react';
import LoginPage from './page';

describe('login page', () => {
  it('shows email, password, and a sign in button', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
