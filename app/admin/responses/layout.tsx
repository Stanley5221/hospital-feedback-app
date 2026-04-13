import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Responses',
  description: 'View and manage feedback responses',
};

export default function ResponsesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
