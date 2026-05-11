'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save } from 'lucide-react';

const sermonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  speaker: z.string().optional(),
  series: z.string().optional(),
  video_url: z.string().min(1, 'Video URL/ID is required'),
  audio_url: z.string().optional().or(z.literal('')),
  source_type: z.enum(['YOUTUBE', 'CLOUDINARY']),
  thumbnail_url: z.string().optional().or(z.literal('')),
  duration: z.coerce.number().min(0).optional(),
});

type SermonFormData = z.infer<typeof sermonSchema>;

interface SermonFormProps {
  initialData?: any;
  onSubmit: (data: SermonFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function SermonForm({ initialData, onSubmit, onCancel, loading }: SermonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SermonFormData>({
    resolver: zodResolver(sermonSchema),
    defaultValues: initialData || { source_type: 'YOUTUBE' },
  });

  const videoUrl = watch('video_url');
  const sourceType = watch('source_type');

  // Auto-generate YouTube thumbnail from video ID
  React.useEffect(() => {
    if (sourceType === 'YOUTUBE' && videoUrl && videoUrl.length === 11) {
      setValue('thumbnail_url', `https://img.youtube.com/vi/${videoUrl}/maxresdefault.jpg`);
    }
  }, [videoUrl, sourceType, setValue]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Sermon' : 'Add New Sermon'}</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Sermon Title *</label>
            <input
              {...register('title')}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. The Power of Grace"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="What is this message about?"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Speaker */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Speaker</label>
              <input
                {...register('speaker')}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Pastor James"
              />
            </div>

            {/* Series */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Series</label>
              <input
                {...register('series')}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Faith & Fire"
              />
            </div>

            {/* Source Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Source *</label>
              <select
                {...register('source_type')}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="YOUTUBE">YouTube</option>
                <option value="CLOUDINARY">Cloudinary</option>
              </select>
            </div>

            {/* Video ID / URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Video ID / URL *</label>
              <input
                {...register('video_url')}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder={sourceType === 'YOUTUBE' ? 'e.g. dQw4w9WgXcQ' : 'https://cloudinary.com/...'}
              />
              {errors.video_url && <p className="text-red-500 text-xs mt-1">{errors.video_url.message}</p>}
            </div>

            {/* Audio URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Audio URL (optional)</label>
              <input
                {...register('audio_url')}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="https://..."
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Thumbnail URL</label>
              <input
                {...register('thumbnail_url')}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Auto-filled for YouTube"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Duration (seconds)</label>
              <input
                type="number"
                {...register('duration')}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. 2400 for 40 mins"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {loading ? 'Saving...' : 'Save Sermon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
