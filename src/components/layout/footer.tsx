export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-background/60">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <span>&copy; {year} Salary Management</span>
        <span className="hidden sm:inline">Built with TDD · Next.js · shadcn/ui</span>
      </div>
    </footer>
  );
}
