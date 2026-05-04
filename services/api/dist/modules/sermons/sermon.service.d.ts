export declare const createSermon: (data: any) => Promise<{
    id: string;
    created_at: Date;
    updated_at: Date;
    title: string;
    description: string;
    video_url: string;
    source_type: import("@prisma/client").$Enums.SourceType;
    thumbnail_url: string | null;
    duration: number | null;
    audio_url: string | null;
}>;
export declare const getSermons: (options: {
    page?: number;
    limit?: number;
}) => Promise<{
    id: string;
    created_at: Date;
    updated_at: Date;
    title: string;
    description: string;
    video_url: string;
    source_type: import("@prisma/client").$Enums.SourceType;
    thumbnail_url: string | null;
    duration: number | null;
    audio_url: string | null;
}[]>;
export declare const getSermonById: (id: string) => Promise<{
    id: string;
    created_at: Date;
    updated_at: Date;
    title: string;
    description: string;
    video_url: string;
    source_type: import("@prisma/client").$Enums.SourceType;
    thumbnail_url: string | null;
    duration: number | null;
    audio_url: string | null;
} | null>;
export declare const updateSermon: (id: string, data: any) => Promise<{
    id: string;
    created_at: Date;
    updated_at: Date;
    title: string;
    description: string;
    video_url: string;
    source_type: import("@prisma/client").$Enums.SourceType;
    thumbnail_url: string | null;
    duration: number | null;
    audio_url: string | null;
}>;
export declare const deleteSermon: (id: string) => Promise<{
    id: string;
    created_at: Date;
    updated_at: Date;
    title: string;
    description: string;
    video_url: string;
    source_type: import("@prisma/client").$Enums.SourceType;
    thumbnail_url: string | null;
    duration: number | null;
    audio_url: string | null;
}>;
