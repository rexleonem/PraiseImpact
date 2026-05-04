import { z } from 'zod';
export declare const createSermonSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        video_url: z.ZodString;
        source_type: z.ZodEnum<{
            YOUTUBE: "YOUTUBE";
            CLOUDINARY: "CLOUDINARY";
        }>;
        thumbnail_url: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateSermonSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        video_url: z.ZodOptional<z.ZodString>;
        source_type: z.ZodOptional<z.ZodEnum<{
            YOUTUBE: "YOUTUBE";
            CLOUDINARY: "CLOUDINARY";
        }>>;
        thumbnail_url: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        duration: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strip>;
}, z.core.$strip>;
