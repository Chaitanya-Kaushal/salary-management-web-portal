'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { EmployeeListResponse } from '@/lib/api-contract';
import type { EmployeeFilters } from './use-url-filters';

export function useEmployees(filters: EmployeeFilters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async (): Promise<EmployeeListResponse> => {
      const res = await apiClient.get<EmployeeListResponse>('/employees', {
        params: filters,
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
}
