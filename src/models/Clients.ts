
export interface Client {
    id: number;
    created_at: Date;
    name: string;
    total_locations?: string;
    authorized_person?: string;
    phone?: string;
    consultantName?: string;
    accountStatus?: string;
};

export interface ClientsPool {
    items: Array<Client>;
    page: number;
    perPage: number;
    totalCount: number;
    sort: string;
    orderBy: string;
};

export const initialClientsPool: ClientsPool = {
    items: [],
    page: 0,
    perPage: 5,
    totalCount: 0,
    sort: "created_at",
    orderBy: "desc"
};

export interface ClientsFilter {
    name: string;
    accountStatus: string;
};

export const initialClientsFilter: ClientsFilter = {
    name: "",
    accountStatus: "",
};

export interface Step1ClientInfo {
    is_commercial?: boolean;
    name?: string;
    tc_id?: string;
    tax_office?: string;
    tax_id?: string;
    email?: string;
    phone?: string;
    website?: string;
    authorized_person?: string;
    contact_person?: string;
    consultant_id?: string;
};

export interface IStep2Location {
    name: string; 
};
export const initialStep2Location: IStep2Location = {
    name: "",
};

export interface IStep3Files {
    name: string; 
};
export const initialStep3Files: IStep3Files = {
    name: "",
};

export interface IStep4Notes {
    name: string; 
    submitForm:boolean;
};
export const initialStep4Notes: IStep4Notes = {
    name: "",
    submitForm:false
};