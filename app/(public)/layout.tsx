import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hospital Feedback',
  description: 'Submit your feedback to help us improve',
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-4">
      {children}
    </div>
  );
}
