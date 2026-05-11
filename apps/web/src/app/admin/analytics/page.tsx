'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Eye, Video, Calendar, TrendingUp, Play } from 'lucide-react';
import api from '@/lib/api';

interface OverviewStats {
  totalUsers: number;
  totalViews: number;
  totalSermons: number;
  totalEvents: number;
}

interface SermonPerf {
  id: string;
  title: string;
  views: number;
  completions: number;
  completionRate: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [performance, setPerformance] = useState<SermonPerf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [statsRes, perfRes] = await Promise.allSettled([
        api.get('/analytics/stats'),
        api.get('/analytics/performance'),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (perfRes.status === 'fulfilled') setPerformance(perfRes.value.data);
    } catch (err) {
      console.error('Error fetching analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const overviewCards = stats
    ? [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { title: 'Total Sermon Views', value: stats.totalViews, icon: Eye, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { title: 'Total Sermons', value: stats.totalSermons, icon: Video, color: 'text-violet-400', bg: 'bg-violet-500/10' },
        { title: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10' },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Engagement metrics and sermon performance.</p>
      </div>

      {/* Overview Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewCards.map((card, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} flex-shrink-0`}>
                <card.icon className={card.color} size={24} />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                <h3 className="text-2xl font-bold text-white">{card.value.toLocaleString()}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sermon Performance */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <BarChart3 className="text-indigo-400" size={22} />
          <h2 className="text-xl font-bold text-white">Sermon Performance</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading performance data...</div>
        ) : performance.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No sermon views tracked yet. Views will appear after users watch sermons.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-sm">
                <th className="p-4 font-medium">Sermon</th>
                <th className="p-4 font-medium text-center">Views</th>
                <th className="p-4 font-medium text-center">Completions</th>
                <th className="p-4 font-medium">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((sermon) => (
                <tr key={sermon.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                        <Play size={14} className="text-indigo-400" />
                      </div>
                      <p className="text-white font-medium text-sm line-clamp-1">{sermon.title}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center text-slate-300 font-medium">{sermon.views}</td>
                  <td className="p-4 text-center text-slate-300">{sermon.completions}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-800 rounded-full h-2 max-w-[120px]">
                        <div
                          className="bg-indigo-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(sermon.completionRate, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-400 min-w-[40px]">
                        {sermon.completionRate.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
