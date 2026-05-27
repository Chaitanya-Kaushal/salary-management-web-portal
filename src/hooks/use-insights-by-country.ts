'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { InsightsByCountry } from '@/lib/api-contract';

export function useInsightsByCountry() {
  return useQuery({
    queryKey: ['insights', 'by-country'],
    queryFn: async (): Promise<InsightsByCountry> => {
      const res = await apiClient.get<InsightsByCountry>('/insights/by-country');
      return res.data;
    },
  });
}
