import { AdminSidebar } from '@/components/admin/AdminSidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal – GEO Trips',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex print:bg-white print:block print:min-h-0">
      <AdminSidebar />
      <main className="flex-1 overflow-auto print:overflow-visible print:p-0 print:m-0 print:block">
        <div className="p-6 lg:p-10 print:p-0 print:m-0">
          {children}
        </div>
      </main>
    </div>
  );
}
