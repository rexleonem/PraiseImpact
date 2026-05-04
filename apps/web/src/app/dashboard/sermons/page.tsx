'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, PlayCircle } from 'lucide-react';
import api from '@/lib/api';
import SermonForm from '@/components/SermonForm';

export default function SermonsPage() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sermons');
      setSermons(res.data);
    } catch (err) {
      console.error('Failed to fetch sermons', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingSermon) {
        await api.put(`/sermons/${editingSermon.id}`, data);
      } else {
        await api.post('/sermons', data);
      }
      setIsFormOpen(false);
      setEditingSermon(null);
      fetchSermons();
    } catch (err) {
      console.error('Failed to save sermon', err);
      alert('Failed to save sermon. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sermon?')) return;
    
    try {
      await api.delete(`/sermons/${id}`);
      fetchSermons();
    } catch (err) {
      console.error('Failed to delete sermon', err);
      alert('Failed to delete sermon.');
    }
  };

  const handleEdit = (sermon: any) => {
    setEditingSermon(sermon);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Sermon Library</h1>
          <p className="text-slate-400 mt-1">Manage all your video content from one place.</p>
        </div>
        <button 
          onClick={() => { setEditingSermon(null); setIsFormOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} />
          Add Sermon
        </button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by title or speaker..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Thumbnail</th>
                <th className="px-6 py-4 font-semibold">Sermon Title</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Date Added</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading sermons...</td>
                </tr>
              ) : sermons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No sermons found. Click "Add Sermon" to get started.</td>
                </tr>
              ) : (
                sermons.map((sermon) => (
                  <tr key={sermon.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-24 aspect-video bg-slate-800 rounded-lg overflow-hidden border border-white/5">
                        {sermon.thumbnail_url ? (
                          <img src={sermon.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PlayCircle className="text-slate-700" size={24} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">{sermon.title}</p>
                      <p className="text-slate-400 text-sm">{sermon.source_type}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {Math.floor((sermon.duration || 0) / 60)} mins
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(sermon.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(sermon)}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(sermon.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
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

      {isFormOpen && (
        <SermonForm 
          initialData={editingSermon}
          onSubmit={handleSubmit}
          onCancel={() => { setIsFormOpen(false); setEditingSermon(null); }}
          loading={formLoading}
        />
      )}
    </div>
  );
}
