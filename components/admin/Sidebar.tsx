'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, BarChart3, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  onLogout: () => void;
}

export const AdminSidebar = ({ onLogout }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/responses', icon: MessageSquare, label: 'Responses' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-6 fixed left-0 top-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Hospital</h2>
        <p className="text-gray-400 text-sm">Feedback System</p>
      </div>

      <nav className="space-y-2 mb-8">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive(href)
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};
