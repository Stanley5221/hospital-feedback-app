import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Hospital feedback admin dashboard',
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
