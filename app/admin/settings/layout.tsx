import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage hospital settings and configuration',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
