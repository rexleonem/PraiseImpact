export declare const login: (email: string, password: string) => Promise<{
    user: {
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        pushToken: string | null;
        created_at: Date;
        updated_at: Date;
    };
    token: string;
} | null>;
export declare const createUser: (data: any) => Promise<{
    id: string;
    email: string;
    password: string;
    role: import("@prisma/client").$Enums.Role;
    pushToken: string | null;
    created_at: Date;
    updated_at: Date;
}>;
export declare const getUserById: (id: string) => Promise<{
    id: string;
    email: string;
    role: import("@prisma/client").$Enums.Role;
    created_at: Date;
} | null>;
