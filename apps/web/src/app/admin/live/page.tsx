'use client';

import React, { useState, useEffect } from 'react';
import { Radio, StopCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

export default function LiveControlPage() {
  const [isLive, setIsLive] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLiveStatus();
  }, []);

  const fetchLiveStatus = async () => {
    try {
      const res = await api.get('/live');
      if (res.data) {
        setIsLive(res.data.is_live);
        setVideoId(res.data.video_id || '');
      }
    } catch (err) {
      console.log('Error fetching live status', err);
    }
  };

  const handleToggleLive = async () => {
    if (!isLive && !videoId) {
      alert('Please enter a YouTube Video ID before going live.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/live', {
        isLive: !isLive,
        videoId: videoId
      });
      setIsLive(res.data.is_live);
      // Keep videoId as per Stage 2 requirements for replay
    } catch (err) {
      console.log('Error updating live status', err);
      alert('Failed to update live status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Live Stream Control</h1>
        <p className="text-slate-400 mt-1">Manage the main broadcast stream for the congregation.</p>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${isLive ? 'border-red-500/30 bg-red-500/10' : 'border-slate-700 bg-slate-800'}`}>
              <Radio className={isLive ? 'text-red-500' : 'text-slate-500'} size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{isLive ? 'ON AIR' : 'OFFLINE'}</h2>
              <p className="text-slate-400 text-sm">
                {isLive ? 'The stream is currently visible to users.' : 'No active stream.'}
              </p>
            </div>
          </div>

          <button 
            onClick={fetchLiveStatus}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
            title="Refresh Status"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">YouTube Video ID</label>
            <input 
              type="text" 
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              disabled={isLive}
              placeholder="e.g. dQw4w9WgXcQ"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
            <p className="text-xs text-slate-500 mt-2">Find this in the YouTube URL (watch?v=YOUR_VIDEO_ID)</p>
          </div>

          <button 
            onClick={handleToggleLive}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
              isLive 
                ? 'bg-slate-800 text-red-500 hover:bg-slate-700 border border-red-500/30' 
                : 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            }`}
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={24} />
            ) : isLive ? (
              <>
                <StopCircle size={24} /> Stop Broadcast
              </>
            ) : (
              <>
                <Radio size={24} /> Go Live
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
