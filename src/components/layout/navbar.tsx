'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet2, LogOut } from 'lucide-react';
import { useMe } from '@/hooks/use-me';
import { useLogout } from '@/hooks/use-logout';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/employees', label: 'Employees' },
  { href: '/insights', label: 'Insights' },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          aria-label="Salary Management"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
            <Wallet2 className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Salary Management</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  active
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="sm" className="gap-2">
                    <span className="hidden sm:inline text-sm">{user.email}</span>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-xs font-semibold uppercase">
                      {user.email[0]}
                    </span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Signed in as
                </DropdownMenuLabel>
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout.mutate()} disabled={logout.isPending}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
