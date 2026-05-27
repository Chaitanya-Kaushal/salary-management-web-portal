'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { InsightsByJobTitle } from '@/lib/api-contract';

export function useInsightsByJobTitle(country?: string) {
  return useQuery({
    queryKey: ['insights', 'by-job-title', country ?? 'all'],
    queryFn: async (): Promise<InsightsByJobTitle> => {
      const res = await apiClient.get<InsightsByJobTitle>('/insights/by-job-title', {
        params: country ? { country } : undefined,
      });
      return res.data;
    },
  });
}
