export declare const getLiveSession: () => Promise<{
    id: string;
    updated_at: Date;
    is_live: boolean;
    video_id: string | null;
    started_at: Date | null;
} | null>;
export declare const updateLiveSession: (data: any) => Promise<{
    id: string;
    updated_at: Date;
    is_live: boolean;
    video_id: string | null;
    started_at: Date | null;
}>;
