import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Control Center – GEO Trips',
  description: 'GEO Trips Administration & Management Desk',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
