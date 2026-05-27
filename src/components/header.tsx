'use client';

import { useMe } from '@/hooks/use-me';
import { useLogout } from '@/hooks/use-logout';

export function Header() {
  const { data } = useMe();
  const logout = useLogout();

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <span className="font-semibold">Salary Management</span>
      <div className="flex items-center gap-3">
        {data && <span className="text-sm text-muted-foreground">{data.email}</span>}
        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="text-sm underline-offset-4 hover:underline disabled:opacity-60"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
