'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, setAuthToken } from '@/lib/api-client';
import type { LoginInput, MeResponse } from '@/lib/api-contract';

type LoginResponse = {
  token: string;
  user: MeResponse;
};

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginInput): Promise<LoginResponse> => {
      const res = await apiClient.post<LoginResponse>('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.setQueryData(['auth', 'me'], data.user);
      router.push('/employees');
    },
  });
}
