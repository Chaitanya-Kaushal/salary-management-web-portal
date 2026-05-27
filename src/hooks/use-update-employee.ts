'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Employee } from '@/lib/api-contract';
import type { EmployeeFormValues } from '@/components/employees/employee-form';

type UpdateInput = { id: string; values: EmployeeFormValues };

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }: UpdateInput): Promise<Employee> => {
      const res = await apiClient.put<Employee>(`/employees/${id}`, values);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
