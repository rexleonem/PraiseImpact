'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Video, 
  Radio, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Video, label: 'Sermons', href: '/admin/sermons' },
  { icon: Radio, label: 'Live Control', href: '/admin/live' },
  { icon: Calendar, label: 'Events', href: '/admin/events' },
  { icon: MessageSquare, label: 'Prayer Requests', href: '/admin/prayer' },
  { icon: Users, label: 'Users', href: '/admin/users' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col">
      <div className="p-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Praise Impact
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Admin Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)] border border-indigo-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
