'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { EmployeeListResponse } from '@/lib/api-contract';

export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<EmployeeListResponse> => {
      const res = await apiClient.get<EmployeeListResponse>('/employees');
      return res.data;
    },
  });
}
