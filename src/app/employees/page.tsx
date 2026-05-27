'use client';

import { useEmployees } from '@/hooks/use-employees';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { EmployeeTable } from '@/components/employees/employee-table';
import { Pagination } from '@/components/employees/pagination';

export default function EmployeesPage() {
  const { filters, setFilters } = useUrlFilters();
  const { data, isLoading } = useEmployees(filters);

  if (isLoading && !data) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p role="status" aria-label="Loading employees" className="text-sm text-muted-foreground">
          Loading employees…
        </p>
      </main>
    );
  }

  if (!data || data.total === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-muted-foreground">No employees yet.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-muted-foreground">{data.total} total</p>
        </div>
      </header>
      <EmployeeTable employees={data.data} />
      <Pagination
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        onPageChange={(nextPage) => setFilters({ page: nextPage })}
      />
    </main>
  );
}
