
export interface Role {
    id: number;
    created_at: Date;
    name: string; 
    user_type?: string;
    accountStatus?: string; 
};

export interface RolesPool {
    items: Array<Role>;
    page: number;
    perPage: number;
    totalCount: number;
    sort: string;
    orderBy: string;
};

export const initialRolesPool: RolesPool = {
    items: [],
    page: 0,
    perPage: 5,
    totalCount: 0,
    sort: "created_at",
    orderBy: "desc"
};

export interface RolesFilter {
    accountStatus?: string;
};

export const initialRolesFilter: RolesFilter = {
    accountStatus: "",
};
