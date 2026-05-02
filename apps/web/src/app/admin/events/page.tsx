'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, MapPin, Trash2, Edit } from 'lucide-react';
import api from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.log('Error fetching events', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e: any) => e.id !== id));
    } catch (err) {
      console.log('Error deleting event', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Events Management</h1>
          <p className="text-slate-400 mt-1">Schedule and manage upcoming church events.</p>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <Plus size={20} />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl">
            No events scheduled.
          </div>
        ) : (
          events.map((event: any) => (
            <div key={event.id} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(event.id)}
                  className="p-2 bg-slate-800 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
                <Calendar size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar size={16} className="text-slate-500" />
                  {new Date(event.date).toLocaleString()}
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MapPin size={16} className="text-slate-500" />
                    {event.location}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
