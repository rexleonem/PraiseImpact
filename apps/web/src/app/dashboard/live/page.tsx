'use client';

import React, { useState, useEffect } from 'react';
import { Radio, StopCircle, RefreshCw, Save } from 'lucide-react';
import api from '@/lib/api';

export default function LiveControlPage() {
  const [isLive, setIsLive] = useState(false);
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchLiveStatus();
  }, []);

  const fetchLiveStatus = async () => {
    setFetching(true);
    try {
      const res = await api.get('/live');
      if (res.data) {
        setIsLive(res.data.is_live);
        setVideoId(res.data.video_id || '');
      }
    } catch (err) {
      console.log('Error fetching live status', err);
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (newStatus: boolean) => {
    if (newStatus && !videoId) {
      alert('Please enter a YouTube Video ID before going live.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/live', {
        isLive: newStatus,
        videoId: videoId
      });
      setIsLive(res.data.is_live);
    } catch (err) {
      console.log('Error updating live status', err);
      alert('Failed to update live status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Live Stream Control</h1>
        <p className="text-slate-400 mt-1">Manage the broadcast engine. Only one stream can be active at a time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-4 ${isLive ? 'border-red-500/30 bg-red-500/10' : 'border-slate-700 bg-slate-800'}`}>
                  <Radio className={isLive ? 'text-red-500' : 'text-slate-500'} size={40} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{isLive ? 'ON AIR' : 'OFFLINE'}</h2>
                  <p className="text-slate-400">
                    {isLive ? 'Broadcasting to all app users.' : 'System is idle.'}
                  </p>
                </div>
              </div>
              <button 
                onClick={fetchLiveStatus}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                title="Refresh Status"
              >
                <RefreshCw className={fetching ? 'animate-spin' : ''} size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">YouTube Video ID</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    disabled={isLive || loading}
                    placeholder="e.g. dQw4w9WgXcQ"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-indigo-500 transition-all disabled:opacity-50 text-lg"
                  />
                  {videoId && !isLive && (
                    <div className="absolute right-4 top-4 text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded">
                      READY
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                  <Activity size={12} />
                  Find this in the YouTube URL: watch?v=<strong>YOUR_VIDEO_ID</strong>
                </p>
              </div>

              <div className="flex gap-4">
                {isLive ? (
                  <button 
                    onClick={() => handleUpdate(false)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-slate-800 text-red-500 hover:bg-slate-700 border border-red-500/30 rounded-2xl font-bold text-lg transition-all"
                  >
                    {loading ? <RefreshCw className="animate-spin" /> : <StopCircle size={24} />}
                    Stop Broadcast
                  </button>
                ) : (
                  <button 
                    onClick={() => handleUpdate(true)}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-red-600 text-white hover:bg-red-700 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-red-600/30"
                  >
                    {loading ? <RefreshCw className="animate-spin" /> : <Radio size={24} />}
                    Go Live Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-indigo-500" />
              Live Guide
            </h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>Start your stream in <strong>OBS Studio</strong> using your YouTube Stream Key.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>Copy the <strong>Video ID</strong> from the YouTube Live Control Room.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>Paste the ID here and click <strong>Go Live Now</strong> to update the app.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
