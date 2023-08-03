
export interface IFile {
    id?: number,
    created_at?: Date;
    name?: string,
    fileableName?: string,
    extension?: string,
    authorized_person?: string,
    path?: string,
};

export interface FilesPool {
    items: Array<IFile>;
    page: number;
    perPage: number;
    totalCount: number;
    sort: string;
    orderBy: string;
};

export const initialFilesPool: FilesPool = {
    items: [],
    page: 0,
    perPage: 5,
    totalCount: 0,
    sort: "created_at",
    orderBy: "desc"
};


export interface FilesFilter {
    name: string;
    module:string;
    category:string; 
};

export const initialFilesFilter: FilesFilter = {
    name: "",
    module: "",
    category: "", 
};
