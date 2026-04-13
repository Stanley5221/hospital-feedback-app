import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Hospital Feedback Admin Panel',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
