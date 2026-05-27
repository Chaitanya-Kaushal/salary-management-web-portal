'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { LoginInput } from '@/lib/api-contract';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => apiClient.post('/auth/login', data),
    onSuccess: () => router.push('/employees'),
  });
}
