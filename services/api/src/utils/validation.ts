import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const sermonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  video_url: z.string().min(1),
  source_type: z.enum(['YOUTUBE', 'CLOUDINARY']),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  duration: z.number().min(0).optional(),
});

export const liveSchema = z.object({
  isLive: z.boolean(),
  videoId: z.string().optional(),
});

export const prayerSchema = z.object({
  content: z.string().min(1).max(1000),
});

export const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  event_date: z.string().datetime(),
});
