import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { RequireAuth } from '@/components/auth/require-auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </RequireAuth>
  );
}
