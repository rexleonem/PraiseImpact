'use client';

import React, { useState, useEffect } from 'react';
import { Video, Plus, Search, Trash2, Edit } from 'lucide-react';
import api from '@/lib/api';

export default function SermonsPage() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    try {
      const res = await api.get('/sermons');
      setSermons(res.data);
    } catch (err) {
      console.log('Error fetching sermons', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sermon?')) return;
    
    try {
      await api.delete(`/sermons/${id}`);
      setSermons(sermons.filter((s: any) => s.id !== id));
    } catch (err) {
      console.log('Error deleting sermon', err);
      alert('Failed to delete sermon');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Sermons Library</h1>
          <p className="text-slate-400 mt-1">Manage video and audio sermons.</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <Plus size={20} />
          New Sermon
        </button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by title, speaker, or series..."
              className="w-full bg-slate-800 border-none text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-sm">
              <th className="p-4 font-medium">Sermon</th>
              <th className="p-4 font-medium">Speaker</th>
              <th className="p-4 font-medium">Series</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">Loading sermons...</td>
              </tr>
            ) : sermons.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No sermons found. Click 'New Sermon' to add one.</td>
              </tr>
            ) : (
              sermons.map((sermon: any) => (
                <tr key={sermon.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                        {sermon.thumbnail_url ? (
                          <img src={sermon.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Video size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{sermon.title}</p>
                        <p className="text-xs text-slate-500">{sermon.source_type.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300">{sermon.speaker}</td>
                  <td className="p-4 text-slate-300">
                    {sermon.series ? (
                      <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded text-xs border border-indigo-500/20">
                        {sermon.series}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {new Date(sermon.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(sermon.id)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
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
