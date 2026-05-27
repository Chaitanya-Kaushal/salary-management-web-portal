'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, clearAuthToken } from '@/lib/api-client';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Logout is stateless on the server; ignore network failures.
      }
    },
    onSuccess: () => {
      clearAuthToken();
      queryClient.clear();
      router.push('/login');
    },
  });
}
