import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import EmployeesPage from './page';

const pushMock = vi.fn();
let searchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
  useSearchParams: () => searchParams,
  usePathname: () => '/employees',
}));

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
  beforeEach(() => {
    pushMock.mockClear();
    searchParams = new URLSearchParams();
  });

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

    expect(await screen.findByRole('status', { name: /loading employees/i })).toBeInTheDocument();
  });

  it('clicking next pushes page=2 to the URL', async () => {
    const employees = Array.from({ length: 10 }, (_, i) =>
      buildEmployee({ id: `e${i + 1}`, fullName: `Employee ${i + 1}` }),
    );

    server.use(
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({ data: employees, total: 25, page: 1, pageSize: 10 }),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<EmployeesPage />);

    await screen.findByText('Employee 1');
    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });
});
