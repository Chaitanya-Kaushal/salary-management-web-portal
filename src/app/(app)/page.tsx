import { AppShell } from '@/components/app-shell';

export default function HomePage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold tracking-tight">Salary Management</h1>
      <p className="mt-2 text-sm text-muted-foreground">HR portal for managing employees.</p>
    </AppShell>
  );
}
