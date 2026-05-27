'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { getAuthToken } from '@/lib/api-client';

function subscribe() {
  return () => {};
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace('/login');
    }
  }, [router]);

  if (mounted && !getAuthToken()) {
    return null;
  }

  return <>{children}</>;
}
