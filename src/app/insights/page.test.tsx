import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import InsightsPage from './page';

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('insights page', () => {
  it('renders total employees and total payroll tiles', async () => {
    server.use(
      http.get('http://localhost:4000/insights/summary', () =>
        HttpResponse.json({
          totalEmployees: 1234,
          totalPayroll: 50_000_000_00,
          topCountries: [],
          topJobTitles: [],
        }),
      ),
    );

    renderWithProviders(<InsightsPage />);

    expect(await screen.findByText('1,234')).toBeInTheDocument();
    expect(await screen.findByText(/total payroll/i)).toBeInTheDocument();
  });
});
