import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { Navbar } from './navbar';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/employees',
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light', setTheme: vi.fn() }),
}));

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('navbar', () => {
  it('renders brand, nav links, theme toggle, user, and sign out', async () => {
    server.use(
      http.get('http://localhost:4000/auth/me', () =>
        HttpResponse.json({ id: 'u1', email: 'hr@corp.example' }),
      ),
    );

    renderWithProviders(<Navbar />);

    expect(screen.getByRole('link', { name: /salary management/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^employees$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^insights$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
    expect(await screen.findByText('hr@corp.example')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('prefers the user name over email when available', async () => {
    server.use(
      http.get('http://localhost:4000/auth/me', () =>
        HttpResponse.json({ id: 'u1', email: 'hr@corp.example', name: 'Priya Sharma' }),
      ),
    );

    renderWithProviders(<Navbar />);

    expect(await screen.findByText('Priya Sharma')).toBeInTheDocument();
  });
});
