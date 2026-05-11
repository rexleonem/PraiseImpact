'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, MapPin, Trash2, Edit, X, Save } from 'lucide-react';
import api from '@/lib/api';

interface EventFormData {
  title: string;
  description: string;
  location: string;
  event_date: string;
}

function EventFormModal({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: {
  initialData?: any;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<EventFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    event_date: initialData?.event_date
      ? new Date(initialData.event_date).toISOString().slice(0, 16)
      : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Event' : 'Create New Event'}</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Event Title *</label>
            <input
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Sunday Worship Night"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="Describe the event..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Main Sanctuary / Online"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date & Time *</label>
            <input
              type="datetime-local"
              name="event_date"
              required
              value={form.event_date}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? 'Saving...' : initialData ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching events', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: EventFormData) => {
    setSubmitting(true);
    try {
      const res = await api.post('/events', data);
      setEvents([res.data, ...events]);
      setShowForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data: EventFormData) => {
    if (!editingEvent) return;
    setSubmitting(true);
    try {
      const res = await api.patch(`/events/${editingEvent.id}`, data);
      setEvents(events.map((e) => (e.id === editingEvent.id ? res.data : e)));
      setEditingEvent(null);
      setShowForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e: any) => e.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Events Management</h1>
          <p className="text-slate-400 mt-1">Schedule and manage upcoming church events.</p>
        </div>
        <button
          onClick={() => { setEditingEvent(null); setShowForm(true); }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          <Plus size={20} />
          Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl">
            No events scheduled yet. Click "Create Event" to add one.
          </div>
        ) : (
          events.map((event: any) => (
            <div key={event.id} className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative group hover:border-white/10 transition-all">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingEvent(event); setShowForm(true); }}
                  className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
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

              <h3 className="text-xl font-bold text-white mb-2 pr-16">{event.title}</h3>
              {event.description && (
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{event.description}</p>
              )}

              <div className="space-y-2 mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar size={16} className="text-slate-500" />
                  {new Date(event.event_date).toLocaleString()}
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

      {showForm && (
        <EventFormModal
          initialData={editingEvent}
          onSubmit={editingEvent ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingEvent(null); }}
          loading={submitting}
        />
      )}
    </div>
  );
}
