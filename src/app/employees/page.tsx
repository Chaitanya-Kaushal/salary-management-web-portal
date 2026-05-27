'use client';

import { useEffect, useRef, useState } from 'react';
import { useEmployees } from '@/hooks/use-employees';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { EmployeeTable } from '@/components/employees/employee-table';
import { EmployeeFilters } from '@/components/employees/employee-filters';
import { Pagination } from '@/components/employees/pagination';
import { EmployeeForm } from '@/components/employees/employee-form';
import { useCreateEmployee } from '@/hooks/use-create-employee';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SEARCH_DEBOUNCE_MS = 300;

export default function EmployeesPage() {
  const { filters, setFilters } = useUrlFilters();
  const { data, isLoading } = useEmployees(filters);

  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const firstRender = useRef(true);
  const [addOpen, setAddOpen] = useState(false);
  const createMutation = useCreateEmployee();

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
      <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-muted-foreground">{data?.total ?? 0} total</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <EmployeeFilters
            country={filters.country}
            department={filters.department}
            jobTitle={filters.jobTitle}
            onChange={(next) => setFilters({ ...next, page: 1 })}
          />
          <input
            type="search"
            placeholder="Search employees"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-64 rounded border px-3 py-2 text-sm"
          />
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger render={<Button>Add employee</Button>} />
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add employee</DialogTitle>
              </DialogHeader>
              <EmployeeForm
                submitLabel="Create"
                isPending={createMutation.isPending}
                onSubmit={(values) =>
                  createMutation.mutate(values, {
                    onSuccess: () => setAddOpen(false),
                  })
                }
              />
            </DialogContent>
          </Dialog>
        </div>
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
