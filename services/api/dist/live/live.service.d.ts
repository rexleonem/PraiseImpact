export declare const getLiveStatus: () => Promise<{
    id: string;
    is_live: boolean;
    youtube_video_id: string | null;
    started_at: Date | null;
    ended_at: Date | null;
} | null>;
export declare const updateLiveStatus: (data: any) => Promise<{
    id: string;
    is_live: boolean;
    youtube_video_id: string | null;
    started_at: Date | null;
    ended_at: Date | null;
} | null>;
