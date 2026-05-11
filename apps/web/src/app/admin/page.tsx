'use client';

import React, { useEffect, useState } from 'react';
import { Users, Video, Radio, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

interface Stats {
  totalSermons: number;
  totalUsers: number;
  pendingPrayers: number;
  totalEvents: number;
  isLive: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSermons: 0,
    totalUsers: 0,
    pendingPrayers: 0,
    totalEvents: 0,
    isLive: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [sermonsRes, liveRes, prayersRes, eventsRes, usersRes] = await Promise.allSettled([
        api.get('/sermons?limit=1'),
        api.get('/live'),
        api.get('/prayers'),
        api.get('/events'),
        api.get('/users'),
      ]);

      setStats({
        totalSermons: sermonsRes.status === 'fulfilled' ? (Array.isArray(sermonsRes.value.data) ? sermonsRes.value.data.length : 0) : 0,
        isLive: liveRes.status === 'fulfilled' ? liveRes.value.data?.is_live ?? false : false,
        pendingPrayers: prayersRes.status === 'fulfilled'
          ? (prayersRes.value.data as any[]).filter((p: any) => p.status === 'pending').length
          : 0,
        totalEvents: eventsRes.status === 'fulfilled' ? (eventsRes.value.data as any[]).length : 0,
        totalUsers: usersRes.status === 'fulfilled' ? (usersRes.value.data?.total ?? 0) : 0,
      });
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Sermons',
      value: loading ? '...' : stats.totalSermons,
      icon: Video,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      href: '/admin/sermons',
    },
    {
      title: 'Stream Status',
      value: loading ? '...' : stats.isLive ? 'LIVE' : 'Offline',
      icon: Radio,
      color: stats.isLive ? 'text-red-400' : 'text-slate-400',
      bg: stats.isLive ? 'bg-red-500/10' : 'bg-slate-700/30',
      href: '/admin/live',
    },
    {
      title: 'Pending Prayers',
      value: loading ? '...' : stats.pendingPrayers,
      icon: MessageSquare,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      href: '/admin/prayer',
    },
    {
      title: 'Registered Users',
      value: loading ? '...' : stats.totalUsers,
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      href: '/admin/users',
    },
  ];

  const quickActions = [
    { label: 'Go Live Now', href: '/admin/live', color: 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.2)]' },
    { label: 'Upload Sermon', href: '/admin/sermons', color: 'bg-indigo-600 hover:bg-indigo-700 shadow-[0_0_20px_rgba(99,102,241,0.2)]' },
    { label: 'Create Event', href: '/admin/events', color: 'bg-slate-700 hover:bg-slate-600' },
    { label: 'View Prayers', href: '/admin/prayer', color: 'bg-slate-700 hover:bg-slate-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back to Praise Impact Admin.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link key={index} href={card.href}>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-all cursor-pointer">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} flex-shrink-0`}>
                <card.icon className={card.color} size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                <h3 className="text-2xl font-bold text-white">{card.value}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`${action.color} text-white p-4 rounded-xl font-medium transition-colors text-center text-sm`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Live Status Banner */}
        <div className={`border p-6 rounded-2xl ${stats.isLive ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-900/50 border-white/5'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-3 h-3 rounded-full ${stats.isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
            <h2 className="text-xl font-bold text-white">{stats.isLive ? '🔴 ON AIR' : 'Stream Offline'}</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            {stats.isLive
              ? 'The live stream is currently active and visible to your congregation.'
              : 'No active stream. Go to Live Stream to start broadcasting.'}
          </p>
          <Link
            href="/admin/live"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              stats.isLive
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Radio size={16} />
            {stats.isLive ? 'Manage Stream' : 'Start Stream'}
          </Link>
        </div>
      </div>
    </div>
  );
}
