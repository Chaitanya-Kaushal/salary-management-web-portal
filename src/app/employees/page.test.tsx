import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import EmployeesPage from './page';

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

describe('employees page', () => {
  it('shows empty state when there are no employees', async () => {
    server.use(
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({ data: [], total: 0, page: 1, pageSize: 10 }),
      ),
    );

    renderWithProviders(<EmployeesPage />);

    expect(await screen.findByText(/no employees/i)).toBeInTheDocument();
  });

  it('renders a table row for each employee', async () => {
    const employees = [
      buildEmployee({ id: 'e1', fullName: 'Alice Anderson' }),
      buildEmployee({ id: 'e2', fullName: 'Bob Brown' }),
      buildEmployee({ id: 'e3', fullName: 'Carol Clark' }),
    ];

    server.use(
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({ data: employees, total: 3, page: 1, pageSize: 10 }),
      ),
    );

    renderWithProviders(<EmployeesPage />);

    for (const emp of employees) {
      expect(await screen.findByText(emp.fullName)).toBeInTheDocument();
    }
  });

  it('shows a loading indicator while fetching', async () => {
    server.use(
      http.get('http://localhost:4000/employees', async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return HttpResponse.json({ data: [], total: 0, page: 1, pageSize: 10 });
      }),
    );

    renderWithProviders(<EmployeesPage />);

    expect(
      await screen.findByRole('status', { name: /loading employees/i }),
    ).toBeInTheDocument();
  });
});
