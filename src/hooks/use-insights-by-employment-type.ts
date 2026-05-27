'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { InsightsByEmploymentType } from '@/lib/api-contract';

export function useInsightsByEmploymentType() {
  return useQuery({
    queryKey: ['insights', 'by-employment-type'],
    queryFn: async (): Promise<InsightsByEmploymentType> => {
      const res = await apiClient.get<InsightsByEmploymentType>('/insights/by-employment-type');
      return res.data;
    },
  });
}
