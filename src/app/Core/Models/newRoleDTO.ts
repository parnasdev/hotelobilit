export interface RoleListReqDTO {
    paginate: boolean;
    perpage: number;
    keyword: string;
}

export interface RoleListResDTO {
    custom_route_name_access: string;
    id: number;
    is_access_dashboard: boolean;
    is_access_panel: boolean;
    is_custom: number;
    is_default: boolean;
    label: string;
    name: string;
    see_all_post: boolean
}

export interface RoleStoreReqDTO {
    name: string;
    label: string;
    is_access_panel: number;
    is_access_dashboard: number;
    is_custom: number;
    see_all_post: number;
    custom_route_name_access: number;
    permissions: permissionDTO[];
}


export interface permissionDTO {
    id: number;
    label: string;
}