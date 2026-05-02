'use client';

import React, { useEffect, useState } from 'react';
import { Users, Video, Radio, MessageSquare } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    sermons: 0,
    liveViewers: 0,
    prayers: 0,
    users: 0
  });

  // Simulating fetching stats
  useEffect(() => {
    // In a real scenario, we would call an endpoint like `/admin/stats`
    setStats({
      sermons: 45,
      liveViewers: 124,
      prayers: 12,
      users: 850
    });
  }, []);

  const statCards = [
    { title: 'Total Sermons', value: stats.sermons, icon: Video, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Live Viewers', value: stats.liveViewers, icon: Radio, color: 'text-red-400', bg: 'bg-red-500/10' },
    { title: 'Pending Prayers', value: stats.prayers, icon: MessageSquare, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Registered Users', value: stats.users, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back to Praise Impact Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg}`}>
              <card.icon className={card.color} size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold text-white">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <Video size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-medium">New sermon uploaded</p>
                  <p className="text-slate-400 text-xs">"The Power of Faith" by Pastor John Doe</p>
                </div>
                <div className="ml-auto text-xs text-slate-500">2h ago</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-xl font-medium transition-colors text-center">
              Go Live Now
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl font-medium transition-colors border border-white/5 text-center">
              Upload Sermon
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl font-medium transition-colors border border-white/5 text-center">
              Create Event
            </button>
            <button className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl font-medium transition-colors border border-white/5 text-center">
              View Prayers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
