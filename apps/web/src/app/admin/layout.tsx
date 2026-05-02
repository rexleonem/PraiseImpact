import React from 'react';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent">
        {children}
      </main>
    </div>
  );
}
