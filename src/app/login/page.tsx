'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet2 } from 'lucide-react';
import { z } from 'zod';
import type { LoginInput } from '@/lib/api-contract';
import { useLogin } from '@/hooks/use-login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useLogin();
  const onSubmit = (data: LoginInput) => loginMutation.mutate(data);

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/10%,transparent_50%),radial-gradient(ellipse_at_bottom,var(--color-primary)/8%,transparent_50%)]"
      />

      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Wallet2 className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Salary Management</h1>
          <p className="text-sm text-muted-foreground">HR portal for your organisation</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Use your HR credentials.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="hr@corp.example"
                  {...register('email')}
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors.password && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {loginMutation.isError && (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                >
                  Sign in failed. Check your email and password.
                </p>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" disabled={loginMutation.isPending} className="w-full">
                {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
              </Button>
              {process.env.NEXT_PUBLIC_API_MOCKING === 'true' && (
                <p className="text-center text-xs text-muted-foreground">
                  Demo mode — any credentials work
                </p>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
