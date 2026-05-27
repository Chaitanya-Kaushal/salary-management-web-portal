'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { InsightsSummary } from '@/lib/api-contract';

export function useInsightsSummary() {
  return useQuery({
    queryKey: ['insights', 'summary'],
    queryFn: async (): Promise<InsightsSummary> => {
      const res = await apiClient.get<InsightsSummary>('/insights/summary');
      return res.data;
    },
  });
}
