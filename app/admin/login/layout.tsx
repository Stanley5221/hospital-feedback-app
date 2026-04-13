import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Admin login',
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
