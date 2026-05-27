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
      topCountries: [
        { country: 'US', count: 500 },
        { country: 'IN', count: 300 },
      ],
      topJobTitles: [],
    }),
  );
}

function byCountryHandler() {
  return http.get('http://localhost:4000/insights/by-country', () =>
    HttpResponse.json([
      {
        country: 'US',
        currency: 'USD',
        count: 50,
        min: 80_000_00,
        max: 250_000_00,
        avg: 150_000_00,
        median: 140_000_00,
        bands: [],
      },
      {
        country: 'IN',
        currency: 'INR',
        count: 30,
        min: 1_000_000_00,
        max: 3_000_000_00,
        avg: 1_500_000_00,
        median: 1_400_000_00,
        bands: [],
      },
    ]),
  );
}

describe('insights page', () => {
  it('renders total employees tile', async () => {
    server.use(summaryHandler());
    renderWithProviders(<InsightsPage />);

    expect(await screen.findByText('1,234')).toBeInTheDocument();
    expect(await screen.findByText(/total employees/i)).toBeInTheDocument();
  });

  it('renders by-country cards using each country currency', async () => {
    server.use(summaryHandler(), byCountryHandler());

    renderWithProviders(<InsightsPage />);

    expect(await screen.findByRole('heading', { name: 'US' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'IN' })).toBeInTheDocument();
    const indiaCard = (await screen.findByRole('heading', { name: 'IN' })).closest('article');
    expect(indiaCard?.textContent).toMatch(/₹|INR/);
    const usCard = (await screen.findByRole('heading', { name: 'US' })).closest('article');
    expect(usCard?.textContent).toMatch(/\$|USD/);
  });

  it('renders salary distribution chart with band labels and counts', async () => {
    server.use(
      summaryHandler(),
      http.get('http://localhost:4000/insights/by-country', () =>
        HttpResponse.json([
          {
            country: 'US',
            currency: 'USD',
            count: 50,
            min: 0,
            max: 0,
            avg: 0,
            median: 0,
            bands: [
              { label: '< 50k', count: 5 },
              { label: '50k–100k', count: 15 },
              { label: '100k–200k', count: 20 },
              { label: '> 200k', count: 10 },
            ],
          },
        ]),
      ),
    );

    renderWithProviders(<InsightsPage />);

    expect(await screen.findByText('< 50k')).toBeInTheDocument();
    expect(await screen.findByText('50k–100k')).toBeInTheDocument();
    expect(await screen.findByText('100k–200k')).toBeInTheDocument();
    expect(await screen.findByText('> 200k')).toBeInTheDocument();
  });

  it('renders headcount by department', async () => {
    server.use(
      summaryHandler(),
      http.get('http://localhost:4000/insights/by-department', () =>
        HttpResponse.json([
          { department: 'Engineering', count: 25 },
          { department: 'Sales', count: 12 },
        ]),
      ),
    );

    renderWithProviders(<InsightsPage />);

    expect(await screen.findByText(/headcount by department/i)).toBeInTheDocument();
    expect(await screen.findByText('Engineering')).toBeInTheDocument();
    expect(await screen.findByText('Sales')).toBeInTheDocument();
  });

  it('renders employment-type breakdown', async () => {
    server.use(
      summaryHandler(),
      http.get('http://localhost:4000/insights/by-employment-type', () =>
        HttpResponse.json([
          { employmentType: 'FULL_TIME', count: 40 },
          { employmentType: 'PART_TIME', count: 5 },
          { employmentType: 'CONTRACTOR', count: 5 },
        ]),
      ),
    );

    renderWithProviders(<InsightsPage />);

    expect(await screen.findByText('Employment type')).toBeInTheDocument();
    expect(await screen.findByText(/full[- ]time/i)).toBeInTheDocument();
    expect(await screen.findByText(/part[- ]time/i)).toBeInTheDocument();
    expect(await screen.findByText(/contractor/i)).toBeInTheDocument();
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
