import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { Header } from './header';

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('header', () => {
  it("shows the logged-in user's email", async () => {
    server.use(
      http.get('http://localhost:4000/auth/me', () =>
        HttpResponse.json({ id: 'u1', email: 'hr@corp.example' }),
      ),
    );

    renderWithProviders(<Header />);

    expect(await screen.findByText('hr@corp.example')).toBeInTheDocument();
  });
});
