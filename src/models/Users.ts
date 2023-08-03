
export interface User {
    id: number;
    created_at: Date;
    name: string;
    phone?: string;
    email: string;
    user_type?: string;
    role?: string;
    accountStatus?: string;
};

export interface UsersPool {
    items: Array<User>;
    page: number;
    perPage: number;
    totalCount: number;
    sort: string;
    orderBy: string;
};

export const initialUsersPool: UsersPool = {
    items: [],
    page: 0,
    perPage: 5,
    totalCount: 0,
    sort: "created_at",
    orderBy: "desc"
};

export interface UsersFilter {
    name: string;
    email: string;
    user_type: string;
    role_id: string;
    accountStatus?: string;
};

export const initialUsersFilter: UsersFilter = {
    name: "",
    email: "",
    role_id: "",
    user_type: "",
    accountStatus: "",
};
