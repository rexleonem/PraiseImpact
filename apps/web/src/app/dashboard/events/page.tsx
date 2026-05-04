'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Plus, Trash2, Edit2, Users } from 'lucide-react';
import api from '@/lib/api';

export default function EventsManagement() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  if (loading) return <div className="text-white p-8">Loading events...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Management</h1>
          <p className="text-slate-400 mt-1">Organize service times, conferences, and community gatherings.</p>
        </div>
        <button 
          onClick={() => { setCurrentEvent(null); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <Calendar size={24} />
                </div>
                <div className="flex gap-2">
                   <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2">{event.description}</p>
              
              <div className="space-y-3 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Calendar size={16} className="text-slate-500" />
                  {new Date(event.event_date).toLocaleString()}
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <MapPin size={16} className="text-slate-500" />
                  {event.location}
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Users size={16} className="text-slate-500" />
                  {event._count?.rsvps || 0} RSVPs
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Placeholder - In a real app this would be a full form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Event</h2>
            <p className="text-slate-400 mb-8 text-sm">Use the API endpoint POST /events to create a production event. This form is a UI placeholder.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-white font-bold border border-white/10 rounded-xl">Cancel</button>
              <button disabled className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl opacity-50 cursor-not-allowed">Save Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
