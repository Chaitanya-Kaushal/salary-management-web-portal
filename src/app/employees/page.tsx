'use client';

import { useEffect, useRef, useState } from 'react';
import { useEmployees } from '@/hooks/use-employees';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { EmployeeTable } from '@/components/employees/employee-table';
import { Pagination } from '@/components/employees/pagination';

const SEARCH_DEBOUNCE_MS = 300;

export default function EmployeesPage() {
  const { filters, setFilters } = useUrlFilters();
  const { data, isLoading } = useEmployees(filters);

  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const handle = setTimeout(() => {
      setFilters({ search: searchInput || undefined, page: 1 });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  if (isLoading && !data) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p role="status" aria-label="Loading employees" className="text-sm text-muted-foreground">
          Loading employees…
        </p>
      </main>
    );
  }

  const hasResults = data && data.data.length > 0;

  return (
    <main className="p-8">
      <header className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-muted-foreground">{data?.total ?? 0} total</p>
        </div>
        <input
          type="search"
          placeholder="Search employees"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-64 rounded border px-3 py-2 text-sm"
        />
      </header>

      {hasResults ? (
        <>
          <EmployeeTable employees={data.data} />
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={(nextPage) => setFilters({ page: nextPage })}
          />
        </>
      ) : (
        <p className="py-12 text-center text-muted-foreground">No employees match.</p>
      )}
    </main>
  );
}
