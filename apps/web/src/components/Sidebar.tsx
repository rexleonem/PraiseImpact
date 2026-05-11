'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Radio,
  PlayCircle,
  MessageSquare,
  Calendar,
  Users,
  BarChart3,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Sermons', href: '/admin/sermons', icon: PlayCircle },
    { name: 'Live Stream', href: '/admin/live', icon: Radio },
    { name: 'Prayer Requests', href: '/admin/prayer', icon: MessageSquare },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <div className="hidden lg:flex w-64 bg-slate-900 border-r border-white/5 flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-bold text-white tracking-tight">Praise Impact</h1>
          <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* --- MOBILE BOTTOM TAB NAV --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 z-50 px-2 pb-safe">
        <nav className="flex justify-around items-center h-20">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 gap-1 min-w-0 py-2 transition-all ${
                  isActive ? 'text-indigo-400 scale-110' : 'text-slate-500'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-500/10' : ''}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tight truncate w-full text-center px-1 ${
                  isActive ? 'opacity-100' : 'opacity-60'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center flex-1 gap-1 text-red-400/60 py-2"
          >
            <LogOut size={22} />
            <span className="text-[10px] font-bold uppercase tracking-tight">Exit</span>
          </button>
        </nav>
      </div>
    </>
  );
}
