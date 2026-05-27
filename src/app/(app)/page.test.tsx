import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import HomePage from './page';

function renderWithProviders(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

function buildEmployee(overrides: Partial<{ id: string; fullName: string }> = {}) {
  return {
    id: 'e1',
    fullName: 'Alice Anderson',
    email: 'alice@example.com',
    jobTitle: 'Engineer',
    department: 'Engineering',
    country: 'US',
    currency: 'USD',
    salary: 12_000_000,
    employmentType: 'FULL_TIME' as const,
    hireDate: '2024-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    ...overrides,
  };
}

describe('home dashboard', () => {
  beforeEach(() => {
    server.use(
      http.get('http://localhost:4000/auth/me', () =>
        HttpResponse.json({ id: 'u1', email: 'hr@corp.example' }),
      ),
      http.get('http://localhost:4000/insights/summary', () =>
        HttpResponse.json({
          totalEmployees: 1234,
          totalPayroll: 0,
          topCountries: [{ country: 'US', count: 500 }],
          topJobTitles: [{ jobTitle: 'Engineer', count: 200 }],
        }),
      ),
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({
          data: [
            buildEmployee({ id: 'e1', fullName: 'Alice Anderson' }),
            buildEmployee({ id: 'e2', fullName: 'Bob Brown' }),
          ],
          total: 2,
          page: 1,
          pageSize: 5,
        }),
      ),
    );
  });

  it('welcomes the user by email', async () => {
    renderWithProviders(<HomePage />);
    expect(await screen.findByText(/hr@corp\.example/i)).toBeInTheDocument();
  });

  it('shows total employees and top country quick-stat cards', async () => {
    renderWithProviders(<HomePage />);
    expect(await screen.findByText('1,234')).toBeInTheDocument();
    expect(await screen.findByText(/total employees/i)).toBeInTheDocument();
    expect(await screen.findByText(/top country/i)).toBeInTheDocument();
  });

  it('lists recent additions', async () => {
    renderWithProviders(<HomePage />);
    expect(await screen.findByText(/recent additions/i)).toBeInTheDocument();
    expect(await screen.findByText('Alice Anderson')).toBeInTheDocument();
    expect(await screen.findByText('Bob Brown')).toBeInTheDocument();
  });

  it('renders quick links to employees and insights', async () => {
    renderWithProviders(<HomePage />);
    expect(await screen.findByRole('link', { name: /manage employees/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /view insights/i })).toBeInTheDocument();
  });
});
