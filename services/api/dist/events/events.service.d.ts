export declare const getEvents: () => Promise<{
    id: string;
    created_at: Date;
    title: string;
    description: string;
    date: Date;
    location: string | null;
}[]>;
export declare const createEvent: (data: any) => Promise<{
    id: string;
    created_at: Date;
    title: string;
    description: string;
    date: Date;
    location: string | null;
}>;
export declare const updateEvent: (id: string, data: any) => Promise<{
    id: string;
    created_at: Date;
    title: string;
    description: string;
    date: Date;
    location: string | null;
}>;
export declare const deleteEvent: (id: string) => Promise<{
    id: string;
    created_at: Date;
    title: string;
    description: string;
    date: Date;
    location: string | null;
}>;
