export declare const createPrayer: (userId: string, content: string) => Promise<{
    id: string;
    created_at: Date;
    updated_at: Date;
    userId: string;
    content: string;
    status: string;
}>;
export declare const getUserPrayers: (userId: string) => Promise<{
    id: string;
    created_at: Date;
    updated_at: Date;
    userId: string;
    content: string;
    status: string;
}[]>;
export declare const getAllPrayers: () => Promise<({
    user: {
        email: string;
    };
} & {
    id: string;
    created_at: Date;
    updated_at: Date;
    userId: string;
    content: string;
    status: string;
})[]>;
export declare const updatePrayerStatus: (id: string, status: string) => Promise<{
    user: {
        id: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        pushToken: string | null;
        created_at: Date;
        updated_at: Date;
    };
} & {
    id: string;
    created_at: Date;
    updated_at: Date;
    userId: string;
    content: string;
    status: string;
}>;
