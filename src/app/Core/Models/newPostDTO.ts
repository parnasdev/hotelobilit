import { RoomDTO } from "./tourDTO";

export interface hotelDTO {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    description: string
    body: string;
    options: [];
    pin: boolean;
    comment: boolean;
    post_type: string;
    status_id: number;
    deleted_at: string;
    created_at: string;
    updated_at: string;
    files: []
}
export interface storeHotelReqDTO {
    id: number
    thumbnail: string
    title: string
    slug: string
    visitCount: number
    user: userDTO
    status: statusObjDTO
}

export interface InfoHotelDTO {
    statuses: statusesDTO[]
    cities: citiesDTO[]
    roomTypes: statusesDTO[]
    post: hotelDTO;
    files: string[],
    service_ids: number[],
    city_id: number;
    rooms: RoomDTO[]
}

export interface storeHotelSetReqDTO {
    title: string | null;
    titleEn: string | null;
    slug: string | null;
    status_id: number | null;
    description: string | null;
    body: string | null;
    use_api: number | null;
    city_id: number | null;
    rooms: roomObjDTO[]
}

export interface roomObjDTO {
    room_type_id: number;
    Adl_capacity: number;
    chd_capacity: number;
    age_child: number;
}

export interface roomDTO {
    id: number;
    name: string;
    room_type_id: number;
    Adl_capacity: number;
    chd_capacity: number;
    age_child: number;
}

export interface statusObjDTO {
    name: string;
    label: string;
    color: string;
}

export interface statusesDTO {
    id: number;
    name: string;
}

export interface userDTO {
    id: number;
    full_name: string;
}

export interface citiesDTO {
    id: number;
    name: string
    categories: categoriesDTO[]
}

export interface categoriesDTO {
    id: number;
    name: string;
}

export interface hotelPageDTO {
    statuses: statusesDTO[];
    cities: citiesDTO[];
    roomTypes: statusesDTO[]
}

export interface ratigListReqDTO {
    fromDate: string;
    toDate: string;
    roomId: number;
    hotelId: number;
}