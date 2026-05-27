'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { EmployeeListResponse } from '@/lib/api-contract';

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/employees/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['employees'] });
      const snapshots = queryClient.getQueriesData<EmployeeListResponse>({
        queryKey: ['employees'],
      });
      snapshots.forEach(([key, value]) => {
        if (!value) return;
        queryClient.setQueryData<EmployeeListResponse>(key, {
          ...value,
          data: value.data.filter((e) => e.id !== id),
          total: Math.max(0, value.total - 1),
        });
      });
      return { snapshots };
    },
    onError: (_err, _id, context) => {
      context?.snapshots.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
