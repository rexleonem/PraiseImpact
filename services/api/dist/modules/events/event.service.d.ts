export declare const createEvent: (data: any) => Promise<{
    id: string;
    created_at: Date;
    updated_at: Date;
    title: string;
    description: string | null;
    location: string | null;
    event_date: Date;
}>;
export declare const getEvents: () => Promise<({
    _count: {
        rsvps: number;
    };
} & {
    id: string;
    created_at: Date;
    updated_at: Date;
    title: string;
    description: string | null;
    location: string | null;
    event_date: Date;
})[]>;
export declare const rsvpEvent: (userId: string, eventId: string) => Promise<{
    id: string;
    created_at: Date;
    userId: string;
    eventId: string;
}>;
export declare const getUserEvents: (userId: string) => Promise<any[]>;
