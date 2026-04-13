import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thank you for your feedback',
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
