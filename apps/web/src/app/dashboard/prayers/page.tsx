'use client';

import React, { useEffect, useState } from 'react';
import { Heart, Clock, CheckCircle2, MessageSquare, Filter } from 'lucide-react';
import api from '@/lib/api';

export default function PrayerManagement() {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/prayers');
      setPrayers(res.data);
    } catch (err) {
      console.error('Failed to fetch prayers', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/prayers/${id}`, { status });
      setPrayers(prayers.map(p => p.id === id ? { ...p, status } : p));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredPrayers = prayers.filter(p => filter === 'all' || p.status === filter);

  if (loading) return <div className="text-white p-8">Loading requests...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Prayer Requests</h1>
          <p className="text-slate-400 mt-1">Interceding for the congregation and tracking breakthroughs.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5">
          {['all', 'pending', 'praying', 'answered'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPrayers.length === 0 ? (
          <div className="bg-slate-900/30 border border-dashed border-white/10 rounded-3xl p-12 text-center">
            <MessageSquare className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-400">No prayer requests found in this category.</p>
          </div>
        ) : (
          filteredPrayers.map((prayer) => (
            <div key={prayer.id} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] bg-white/5 text-slate-400 px-2 py-1 rounded-md font-bold uppercase tracking-widest">
                    {prayer.user.email}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(prayer.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white text-lg leading-relaxed">{prayer.content}</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button 
                  onClick={() => updateStatus(prayer.id, 'pending')}
                  className={`p-3 rounded-xl transition-all ${prayer.status === 'pending' ? 'bg-slate-700 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
                  title="Mark as Pending"
                >
                  <Clock size={20} />
                </button>
                <button 
                   onClick={() => updateStatus(prayer.id, 'praying')}
                  className={`p-3 rounded-xl transition-all ${prayer.status === 'praying' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-500 hover:text-red-400'}`}
                  title="Mark as Praying"
                >
                  <Heart size={20} />
                </button>
                <button 
                   onClick={() => updateStatus(prayer.id, 'answered')}
                  className={`p-3 rounded-xl transition-all ${prayer.status === 'answered' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-500 hover:text-emerald-400'}`}
                  title="Mark as Answered"
                >
                  <CheckCircle2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
