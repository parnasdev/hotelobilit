export interface RoomListDTO {
    Adl_capacity: number;
    age_child: number;
    chd_capacity: number;
    id: number;
    name: string;
}

export interface RoomReqDTO {
    name: string;
    Adl_capacity: number;
    chd_capacity: number;  
    age_child: number;
    parent_id: number | null;
}