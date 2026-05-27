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

function summaryHandler() {
  return http.get('http://localhost:4000/insights/summary', () =>
    HttpResponse.json({
      totalEmployees: 1234,
      totalPayroll: 50_000_000_00,
      topCountries: [],
      topJobTitles: [],
    }),
  );
}

function byCountryHandler() {
  return http.get('http://localhost:4000/insights/by-country', () =>
    HttpResponse.json([
      {
        country: 'US',
        count: 50,
        min: 80_000_00,
        max: 250_000_00,
        avg: 150_000_00,
        median: 140_000_00,
        bands: [],
      },
    ]),
  );
}

describe('insights page', () => {
  it('renders total employees and total payroll tiles', async () => {
    server.use(summaryHandler());
    renderWithProviders(<InsightsPage />);

    expect(await screen.findByText('1,234')).toBeInTheDocument();
    expect(await screen.findByText(/total payroll/i)).toBeInTheDocument();
  });

  it('renders by-country cards with min, max, avg, median', async () => {
    server.use(summaryHandler(), byCountryHandler());

    renderWithProviders(<InsightsPage />);

    expect(await screen.findByRole('heading', { name: 'US' })).toBeInTheDocument();
    expect(await screen.findByText(/min/i)).toBeInTheDocument();
    expect(await screen.findByText(/max/i)).toBeInTheDocument();
    expect(await screen.findByText(/median/i)).toBeInTheDocument();
  });

  it('renders average salary by job title', async () => {
    server.use(
      summaryHandler(),
      byCountryHandler(),
      http.get('http://localhost:4000/insights/by-job-title', () =>
        HttpResponse.json([
          { jobTitle: 'Engineer', count: 30, avg: 150_000_00 },
          { jobTitle: 'Manager', count: 10, avg: 200_000_00 },
        ]),
      ),
    );

    renderWithProviders(<InsightsPage />);

    expect(await screen.findByText('Engineer')).toBeInTheDocument();
    expect(await screen.findByText('Manager')).toBeInTheDocument();
  });
});
