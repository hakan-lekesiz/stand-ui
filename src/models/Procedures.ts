
export interface Procedure {
    id: number;
    accreditation: string;
    name: string;
    standard: string;
};

export interface ProceduresPool {
    items: Array<Procedure>;
    page: number;
    perPage: number;
    totalCount: number;
    sort: string;
    orderBy: string;
};

export const initialProceduresPool: ProceduresPool = {
    items: [],
    page: 0,
    perPage: 5,
    totalCount: 0,
    sort: "created_at",
    orderBy: "desc"
};

export interface ProceduresFilter {
    procedureStatus?: string;
};

export const initialProceduresFilter: ProceduresFilter = {
    procedureStatus: "",
};
