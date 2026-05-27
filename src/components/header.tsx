'use client';

import { useMe } from '@/hooks/use-me';

export function Header() {
  const { data } = useMe();

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <span className="font-semibold">Salary Management</span>
      <div className="flex items-center gap-3">
        {data && <span className="text-sm text-muted-foreground">{data.email}</span>}
      </div>
    </header>
  );
}
