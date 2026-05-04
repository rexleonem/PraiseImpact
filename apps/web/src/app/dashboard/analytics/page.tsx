'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, PlayCircle, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '@/lib/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsRes, perfRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/analytics/performance'),
      ]);
      setStats(statsRes.data);
      setPerformance(perfRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading insights...</div>;
  }

  const cards = [
    { name: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', trend: '+12%' },
    { name: 'Sermon Views', value: stats?.totalViews || 0, icon: PlayCircle, color: 'text-indigo-500', trend: '+24%' },
    { name: 'Total Sermons', value: stats?.totalSermons || 0, icon: Award, color: 'text-emerald-500', trend: 'Stable' },
    { name: 'Community Events', value: stats?.totalEvents || 0, icon: TrendingUp, color: 'text-amber-500', trend: '+5%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Intelligence</h1>
        <p className="text-slate-400 mt-1">Real-time data on how your congregation is engaging with the Word.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${card.color}`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${card.trend.includes('+') ? 'text-emerald-500' : 'text-slate-500'}`}>
                   {card.trend.includes('+') ? <ArrowUpRight size={14} /> : null}
                   {card.trend}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400">{card.name}</p>
              <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
              <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={80} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white">Sermon Engagement</h2>
            <p className="text-sm text-slate-400 mt-1">Ranking messages by their impact and completion rates.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Message Title</th>
                  <th className="px-6 py-4 font-semibold">Total Views</th>
                  <th className="px-6 py-4 font-semibold">Completion Rate</th>
                  <th className="px-6 py-4 font-semibold text-right">Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {performance.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-slate-300">{item.views}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${Math.min(item.completionRate, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 font-bold">{Math.round(item.completionRate)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.completionRate > 70 ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider">High Retention</span>
                      ) : item.views > 100 ? (
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider">Needs Polish</span>
                      ) : (
                        <span className="text-[10px] bg-slate-500/10 text-slate-400 px-2 py-1 rounded-full font-bold uppercase tracking-wider">New Content</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-8 text-white">
            <BarChart3 className="mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Engagement Summary</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Your congregation is most active on <strong>Sundays</strong> between <strong>9 AM and 11 AM</strong>. 
              Sermons under <strong>40 minutes</strong> have a 30% higher completion rate.
            </p>
            <button className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
              Export PDF Report
            </button>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
             <h4 className="text-white font-bold mb-4">Trending Tags</h4>
             <div className="flex flex-wrap gap-2">
                {['#Faith', '#Grace', '#SundayService', '#Healing', '#Community'].map(tag => (
                  <span key={tag} className="text-xs bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-700 cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
