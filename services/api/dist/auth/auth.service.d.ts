export declare const registerUser: (data: any) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    token: string;
}>;
export declare const loginUser: (data: any) => Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    token: string;
}>;
