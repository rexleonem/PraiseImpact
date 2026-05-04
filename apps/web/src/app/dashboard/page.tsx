'use client';

import React, { useEffect, useState } from 'react';
import { Radio, PlayCircle, Users, Activity } from 'lucide-react';
import api from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    sermons: 0,
    isLive: false,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [sermonsRes, liveRes] = await Promise.all([
          api.get('/sermons'),
          api.get('/live'),
        ]);
        setStats({
          sermons: sermonsRes.data.length,
          isLive: liveRes.data.is_live,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Sermons', value: stats.sermons, icon: PlayCircle, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Live Status', value: stats.isLive ? 'Online' : 'Offline', icon: Radio, color: stats.isLive ? 'text-red-500' : 'text-slate-500', bg: stats.isLive ? 'bg-red-500/10' : 'bg-slate-500/10' },
    { name: 'App Users', value: 'Coming Soon', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'System Load', value: 'Normal', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">{card.name}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Ready to broadcast?</h2>
          <p className="text-indigo-100 max-w-md mb-6">
            Your congregation is waiting. Start a live stream or add new sermons to keep them engaged.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              Go Live Now
            </button>
          </div>
        </div>
        <Radio className="absolute -right-8 -bottom-8 text-indigo-500/20" size={240} />
      </div>
    </div>
  );
}
