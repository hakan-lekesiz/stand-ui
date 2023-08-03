
export interface Revision {
    id: number;
    created_at: Date;
    key?: string;
    old_value?: string;
    new_value?: string;
    user?: string; 
};

export interface RevisionsPool {
    items: Array<Revision>;
    page: number;
    perPage: number;
    totalCount: number;
    sort: string;
    orderBy: string;
};

export const initialRevisionsPool: RevisionsPool = {
    items: [],
    page: 0,
    perPage: 5,
    totalCount: 0,
    sort: "created_at",
    orderBy: "desc"
};
 
