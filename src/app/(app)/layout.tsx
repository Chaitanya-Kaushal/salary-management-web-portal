import { connection } from 'next/server';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { RequireAuth } from '@/components/auth/require-auth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Auth state lives in client-side localStorage, so these routes can't be prerendered.
  // connection() opts the whole (app) subtree out of static rendering.
  await connection();
  return (
    <RequireAuth>
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </RequireAuth>
  );
}
