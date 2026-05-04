import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const sermonSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    video_url: z.ZodString;
    source_type: z.ZodEnum<{
        YOUTUBE: "YOUTUBE";
        CLOUDINARY: "CLOUDINARY";
    }>;
    thumbnail_url: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    duration: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const liveSchema: z.ZodObject<{
    isLive: z.ZodBoolean;
    videoId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const prayerSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strip>;
export declare const eventSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    event_date: z.ZodString;
}, z.core.$strip>;
