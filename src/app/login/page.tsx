'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api-client';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginInput = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => apiClient.post('/auth/login', data),
    onSuccess: () => router.push('/employees'),
  });

  const onSubmit = (data: LoginInput) => loginMutation.mutate(data);

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full rounded border px-3 py-2"
          />
          {errors.email && (
            <p role="alert" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full rounded border px-3 py-2"
          />
          {errors.password && (
            <p role="alert" className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {loginMutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            Sign in failed. Check your email and password.
          </p>
        )}

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded bg-foreground py-2 text-background disabled:opacity-60"
        >
          {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
