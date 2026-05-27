'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Employee } from '@/lib/api-contract';
import type { EmployeeFormValues } from '@/components/employees/employee-form';

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EmployeeFormValues): Promise<Employee> => {
      const res = await apiClient.post<Employee>('/employees', input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
