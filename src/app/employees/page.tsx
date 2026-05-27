'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { EmployeeTable } from '@/components/employees/employee-table';
import type { EmployeeListResponse } from '@/lib/api-contract';

export default function EmployeesPage() {
  const { data } = useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<EmployeeListResponse> => {
      const res = await apiClient.get<EmployeeListResponse>('/employees');
      return res.data;
    },
  });

  if (!data || data.data.length === 0) {
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
    </main>
  );
}
