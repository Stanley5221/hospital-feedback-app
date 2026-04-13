'use client';

import { ReactNode } from 'react';
import { AdminSidebar } from './Sidebar';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="flex">
      <AdminSidebar onLogout={handleLogout} />
      <div className="ml-64 flex-1 bg-gray-50 min-h-screen">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};
