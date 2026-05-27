'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { MeResponse } from '@/lib/api-contract';

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async (): Promise<MeResponse> => {
      const { data } = await apiClient.get<MeResponse>('/auth/me');
      return data;
    },
  });
}
