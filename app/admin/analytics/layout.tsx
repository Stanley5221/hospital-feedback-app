import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'View feedback analytics and insights',
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
