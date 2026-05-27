'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Search, UserPlus } from 'lucide-react';
import { useEmployees } from '@/hooks/use-employees';
import { useUrlFilters } from '@/hooks/use-url-filters';
import { useCreateEmployee } from '@/hooks/use-create-employee';
import { useUpdateEmployee } from '@/hooks/use-update-employee';
import { useDeleteEmployee } from '@/hooks/use-delete-employee';
import { EmployeeTable } from '@/components/employees/employee-table';
import { EmployeeFilters } from '@/components/employees/employee-filters';
import { Pagination } from '@/components/employees/pagination';
import { EmployeeForm, type EmployeeFormValues } from '@/components/employees/employee-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Employee } from '@/lib/api-contract';

const SEARCH_DEBOUNCE_MS = 300;

export default function EmployeesPage() {
  const { filters, setFilters } = useUrlFilters();
  const { data, isLoading, isError } = useEmployees(filters);

  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const firstRender = useRef(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

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

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center">
          <p role="alert" className="text-sm text-destructive">
            Could not load employees. Please try again.
          </p>
        </div>
      </main>
    );
  }

  const hasResults = data && data.data.length > 0;
  const showLoadingSkeleton = isLoading && !data;

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.total.toLocaleString()} total` : 'Loading…'}
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Add employee
              </Button>
            }
          />
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add employee</DialogTitle>
            </DialogHeader>
            {createMutation.isError && (
              <p role="alert" className="text-sm text-destructive">
                Could not save employee. Please try again.
              </p>
            )}
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
      </header>

      <Card>
        <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <EmployeeFilters
            country={filters.country}
            department={filters.department}
            jobTitle={filters.jobTitle}
            onChange={(next) => setFilters({ ...next, page: 1 })}
          />
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {showLoadingSkeleton ? (
            <div role="status" aria-label="Loading employees" className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : hasResults ? (
            <>
              <EmployeeTable
                employees={data.data}
                onEdit={(emp) => setEditEmployee(emp)}
                onDelete={(emp) => setDeleteEmployee(emp)}
              />
              <Pagination
                page={data.page}
                pageSize={data.pageSize}
                total={data.total}
                onPageChange={(nextPage) => setFilters({ page: nextPage })}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
                <UserPlus className="h-5 w-5" />
              </span>
              <p className="text-sm text-muted-foreground">No employees match.</p>
              <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Add an employee
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editEmployee)} onOpenChange={(open) => !open && setEditEmployee(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit employee</DialogTitle>
          </DialogHeader>
          {updateMutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              Could not save employee. Please try again.
            </p>
          )}
          {editEmployee && (
            <EmployeeForm
              defaultValues={toFormValues(editEmployee)}
              submitLabel="Save"
              isPending={updateMutation.isPending}
              onSubmit={(values) =>
                updateMutation.mutate(
                  { id: editEmployee.id, values },
                  { onSuccess: () => setEditEmployee(null) },
                )
              }
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteEmployee)}
        onOpenChange={(open) => !open && setDeleteEmployee(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteEmployee?.fullName} will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteEmployee) return;
                deleteMutation.mutate(deleteEmployee.id);
                setDeleteEmployee(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function toFormValues(e: Employee): EmployeeFormValues {
  return {
    fullName: e.fullName,
    email: e.email,
    jobTitle: e.jobTitle,
    department: e.department,
    country: e.country,
    currency: e.currency,
    salary: e.salary,
    employmentType: e.employmentType,
    hireDate: e.hireDate.slice(0, 10),
  };
}
