'use client';

import { useEffect, useState } from 'react';

const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === 'true';

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(!MOCKING_ENABLED);

  useEffect(() => {
    if (!MOCKING_ENABLED) return;
    let cancelled = false;
    import('@/mocks/browser').then(({ worker }) =>
      worker
        .start({ onUnhandledRequest: 'bypass', quiet: true })
        .then(() => !cancelled && setReady(true)),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
