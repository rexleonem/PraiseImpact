export declare const createRequest: (userId: string | null, data: any) => Promise<{
    id: string;
    created_at: Date;
    message: string;
    is_anonymous: boolean;
    status: string;
    user_id: string | null;
}>;
export declare const getRequests: () => Promise<({
    user: {
        name: string;
        email: string;
    } | null;
} & {
    id: string;
    created_at: Date;
    message: string;
    is_anonymous: boolean;
    status: string;
    user_id: string | null;
})[]>;
export declare const updateStatus: (id: string, status: string) => Promise<{
    id: string;
    created_at: Date;
    message: string;
    is_anonymous: boolean;
    status: string;
    user_id: string | null;
}>;
