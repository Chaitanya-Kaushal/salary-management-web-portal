'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet2, LogOut, Menu } from 'lucide-react';
import { useMe } from '@/hooks/use-me';
import { useLogout } from '@/hooks/use-logout';
import { ThemeToggle } from './theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  const displayName = user?.name ?? user?.email ?? '';
  const initial = displayName ? displayName[0] : '';

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-primary/10 bg-primary/5 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:gap-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          aria-label="Salary Management"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Wallet2 className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">Salary Management</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                isActive(item.href)
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          <ThemeToggle />

          {user && (
            <>
              <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-background/60 py-1 pl-1 pr-1 sm:pr-3">
                <span
                  aria-hidden
                  className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold uppercase text-primary-foreground shadow-sm"
                >
                  {initial}
                </span>
                <span className="hidden text-sm font-medium text-foreground sm:inline">
                  {displayName}
                </span>
              </div>

              {/* Desktop sign out */}
              <button
                type="button"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                aria-label="Sign out"
                title="Sign out"
                className="hidden h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-60 md:grid"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open menu"
                className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {NAV_ITEMS.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    render={<Link href={item.href} />}
                    className={cn(isActive(item.href) && 'text-primary')}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
                {user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => logout.mutate()}
                      disabled={logout.isPending}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
