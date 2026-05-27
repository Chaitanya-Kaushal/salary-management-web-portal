import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { Header } from './header';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('header', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("shows the logged-in user's email", async () => {
    server.use(
      http.get('http://localhost:4000/auth/me', () =>
        HttpResponse.json({ id: 'u1', email: 'hr@corp.example' }),
      ),
    );

    renderWithProviders(<Header />);

    expect(await screen.findByText('hr@corp.example')).toBeInTheDocument();
  });

  it('logs out and redirects to /login when sign out is clicked', async () => {
    server.use(
      http.get('http://localhost:4000/auth/me', () =>
        HttpResponse.json({ id: 'u1', email: 'hr@corp.example' }),
      ),
      http.post(
        'http://localhost:4000/auth/logout',
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<Header />);

    await screen.findByText('hr@corp.example');
    await user.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });
});
