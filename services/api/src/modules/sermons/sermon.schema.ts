import { z } from 'zod';

export const createSermonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  speaker: z.string().optional(),
  series: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  video_url: z.string().min(1, 'Video URL/ID is required'),
  audio_url: z.string().optional(),
  source_type: z.enum(['YOUTUBE', 'CLOUDINARY']),
  thumbnail_url: z.string().optional(),
  duration: z.number().int().min(0).optional(),
});

export const updateSermonSchema = createSermonSchema.partial();
