
export interface INote {
    id: number,
    created_at: Date;
    content: string,
    remind_at: string,
    authorized_person: string,
    completed: string,
    notable_id:string,
    notable_type:string
};

export interface NotesPool {
    items: Array<INote>;
    page: number;
    perPage: number;
    totalCount: number;
    sort: string;
    orderBy: string;
};

export const initialNotesPool: NotesPool = {
    items: [],
    page: 0,
    perPage: 5,
    totalCount: 0,
    sort: "created_at",
    orderBy: "desc"
};


export interface NotesFilter {
    content: string;
    module:string;
    completed:string; 
};

export const initialNotesFilter: NotesFilter = {
    content: "",
    module: "",
    completed: "", 
};