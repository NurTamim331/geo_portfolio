import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Dashboard – GEO Trips',
  description: 'Manage your trips, invoices, and visa applications.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-10 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
