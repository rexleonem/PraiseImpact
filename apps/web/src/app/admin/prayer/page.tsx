'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';
import api from '@/lib/api';

export default function PrayerPage() {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const res = await api.get('/prayer');
      setPrayers(res.data);
    } catch (err) {
      console.log('Error fetching prayers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/prayer/${id}`, { status });
      setPrayers(prayers.map((p: any) => p.id === id ? { ...p, status } : p));
    } catch (err) {
      console.log('Error updating status', err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Prayer Requests</h1>
        <p className="text-slate-400 mt-1">Manage and respond to community prayer requests.</p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-sm">
              <th className="p-4 font-medium">Request</th>
              <th className="p-4 font-medium">From</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">Loading prayers...</td>
              </tr>
            ) : prayers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No prayer requests at this time.</td>
              </tr>
            ) : (
              prayers.map((prayer: any) => (
                <tr key={prayer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-start gap-3 max-w-md">
                      <MessageSquare className="text-slate-500 mt-1 flex-shrink-0" size={18} />
                      <p className="text-white text-sm leading-relaxed">{prayer.message}</p>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">
                    {prayer.is_anonymous ? (
                      <span className="italic text-slate-500">Anonymous</span>
                    ) : (
                      prayer.user?.name || 'Unknown'
                    )}
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {new Date(prayer.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${
                      prayer.status === 'prayed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {prayer.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {prayer.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(prayer.id, 'prayed')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm transition-colors border border-emerald-500/20"
                        >
                          <CheckCircle size={14} /> Mark Prayed
                        </button>
                      )}
                      {prayer.status === 'prayed' && (
                        <button 
                          onClick={() => handleUpdateStatus(prayer.id, 'pending')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-sm transition-colors border border-white/5"
                        >
                          <Clock size={14} /> Reopen
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
