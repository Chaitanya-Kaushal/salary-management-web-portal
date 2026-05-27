import { render, screen, waitFor, within } from '@testing-library/react';
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

  it('typing in search pushes search param to the URL', async () => {
    const employees = [buildEmployee({ id: 'e1', fullName: 'Alice Anderson' })];
    server.use(
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({ data: employees, total: 1, page: 1, pageSize: 10 }),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<EmployeesPage />);

    await screen.findByText('Alice Anderson');
    await user.type(screen.getByPlaceholderText(/search/i), 'bob');

    await waitFor(
      () => {
        expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('search=bob'));
      },
      { timeout: 1000 },
    );
  });

  it('clicking add opens a dialog with form fields and validates required name', async () => {
    server.use(
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({ data: [], total: 0, page: 1, pageSize: 10 }),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<EmployeesPage />);

    await screen.findByText(/no employees/i);
    await user.click(screen.getByRole('button', { name: /add employee/i }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^create$/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
  });

  it('submitting add posts the new employee and closes the dialog', async () => {
    let captured: Record<string, unknown> | null = null;
    server.use(
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({ data: [], total: 0, page: 1, pageSize: 10 }),
      ),
      http.post('http://localhost:4000/employees', async ({ request }) => {
        captured = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({ id: 'new-id', ...captured }, { status: 201 });
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<EmployeesPage />);
    await screen.findByText(/no employees/i);

    await user.click(screen.getByRole('button', { name: /add employee/i }));

    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText(/full name/i), 'Dave Davis');
    await user.type(within(dialog).getByLabelText(/^email$/i), 'dave@example.com');
    await user.type(within(dialog).getByLabelText(/job title/i), 'Engineer');
    await user.type(within(dialog).getByLabelText(/department/i), 'Engineering');
    await user.type(within(dialog).getByLabelText(/country code/i), 'US');
    await user.type(within(dialog).getByLabelText(/currency code/i), 'USD');
    await user.type(within(dialog).getByLabelText(/salary/i), '5000000');
    await user.type(within(dialog).getByLabelText(/hire date/i), '2024-01-01');
    await user.click(within(dialog).getByRole('button', { name: /^create$/i }));

    await waitFor(() => {
      expect(captured).toMatchObject({ fullName: 'Dave Davis', email: 'dave@example.com' });
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('clicking edit opens a dialog pre-filled with the row data', async () => {
    const employee = buildEmployee({ id: 'e1', fullName: 'Alice Anderson' });
    server.use(
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({ data: [employee], total: 1, page: 1, pageSize: 10 }),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<EmployeesPage />);
    await screen.findByText('Alice Anderson');

    await user.click(screen.getByRole('button', { name: /edit alice anderson/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByLabelText(/full name/i)).toHaveValue('Alice Anderson');
  });

  it('clicking delete confirms then calls DELETE for the employee', async () => {
    let deletedId: string | null = null;
    const employee = buildEmployee({ id: 'e1', fullName: 'Alice Anderson' });
    server.use(
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({ data: [employee], total: 1, page: 1, pageSize: 10 }),
      ),
      http.delete('http://localhost:4000/employees/:id', ({ params }) => {
        deletedId = params.id as string;
        return new HttpResponse(null, { status: 204 });
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<EmployeesPage />);
    await screen.findByText('Alice Anderson');

    await user.click(screen.getByRole('button', { name: /delete alice anderson/i }));

    const confirmDialog = await screen.findByRole('alertdialog');
    await user.click(within(confirmDialog).getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(deletedId).toBe('e1');
    });
  });

  it('selecting a country filter pushes country param to the URL', async () => {
    const employees = [buildEmployee({ id: 'e1', fullName: 'Alice Anderson' })];
    server.use(
      http.get('http://localhost:4000/employees', () =>
        HttpResponse.json({ data: employees, total: 1, page: 1, pageSize: 10 }),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<EmployeesPage />);

    await screen.findByText('Alice Anderson');
    await user.selectOptions(screen.getByLabelText(/country/i), 'US');

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('country=US'));
    });
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
