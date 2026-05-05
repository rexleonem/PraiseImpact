import { z } from 'zod';

export const updateLiveSchema = z.object({
  isLive: z.boolean(),
  videoId: z.string().optional(),
});
