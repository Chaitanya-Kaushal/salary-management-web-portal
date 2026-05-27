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
});
