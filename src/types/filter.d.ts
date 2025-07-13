export type FilterProps<T = {}> = {
    page: number;
    limit: number;
    by: string;
    direction: 'asc'|'desc';
    search?: string;
    id?: string|number;
    status?: true|false|null;
} & T;