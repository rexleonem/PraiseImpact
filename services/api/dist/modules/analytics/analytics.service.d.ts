export declare const logEvent: (data: any) => Promise<{
    id: string;
    created_at: Date;
    userId: string | null;
    type: string;
    sermonId: string | null;
    meta: import("@prisma/client/runtime/client").JsonValue | null;
}>;
export declare const getOverviewStats: () => Promise<{
    totalUsers: number;
    totalViews: number;
    totalSermons: number;
    totalEvents: number;
}>;
export declare const getSermonPerformance: () => Promise<{
    id: string;
    title: string;
    views: number;
    completions: number;
    completionRate: number;
}[]>;
