import { z } from 'zod';
export declare const updateLiveSchema: z.ZodObject<{
    body: z.ZodObject<{
        isLive: z.ZodBoolean;
        videoId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
