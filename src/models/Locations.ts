
export interface ILocation {
    id?: number,
    created_at?: Date;
    name?: string,
    location_definition?:string,
    location_definition_id?: number,
    city_id?: number,
    district_id?: number,
    address?: string,
    branch_agent?: string,
    phone_number?: string,
    employee_count?: number,
    production_employee_count?: number,
    double_up_employee_count?: number,
    nature_of_business?: string,
    shift_count?: number,
    shift_employee_count?: number,
    management_employee_count?: number,
    parttime_employee_count?: number,
    client_id?: any,
    city_district?:string
};

export interface LocationsPool {
    items: Array<ILocation>;
    page: number;
    perPage: number;
    totalCount: number;
    sort: string;
    orderBy: string;
};

export const initialLocationsPool: LocationsPool = {
    items: [],
    page: 0,
    perPage: 5,
    totalCount: 0,
    sort: "created_at",
    orderBy: "desc"
};