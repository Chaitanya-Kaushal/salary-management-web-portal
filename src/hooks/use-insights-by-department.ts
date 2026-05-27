'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { InsightsByDepartment } from '@/lib/api-contract';

export function useInsightsByDepartment() {
  return useQuery({
    queryKey: ['insights', 'by-department'],
    queryFn: async (): Promise<InsightsByDepartment> => {
      const res = await apiClient.get<InsightsByDepartment>('/insights/by-department');
      return res.data;
    },
  });
}
