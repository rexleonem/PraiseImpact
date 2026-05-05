import { z } from 'zod';

export const createSermonSchema = z.object({
  title: z.string(),
  description: z.string(),
  video_url: z.string().url(),
  source_type: z.enum(['YOUTUBE', 'CLOUDINARY']),
  thumbnail_url: z.string().url().optional(),
  duration: z.number().int().optional(),
});

export const updateSermonSchema = createSermonSchema.partial();
