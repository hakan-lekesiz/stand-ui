
export interface Education {
    id: number;
    created_at: Date;
    name: string;
    phone?: string;
    email?: string;
    education_type?: string;
    role?: string;
    educationStatus?: string;
    city_district?: string;
    subjectName?:string;
    clientType?:string;
    amount?:any;
};

export interface EducationsPool {
    items: Array<Education>;
    page: number;
    perPage: number;
    totalCount: number;
    sort: string;
    orderBy: string;
};

export const initialEducationsPool: EducationsPool = {
    items: [],
    page: 0,
    perPage: 5,
    totalCount: 0,
    sort: "created_at",
    orderBy: "desc"
};

export interface EducationsFilter {
    educationStatus: string;
    client_id:string;
    subject_id:string;
    status_id:string;
    description:string;
};

export const initialEducationsFilter: EducationsFilter = {
    educationStatus: "",
    client_id: "",
    subject_id: "",
    status_id: "",
    description: "",
};
