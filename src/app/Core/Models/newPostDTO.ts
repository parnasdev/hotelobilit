
export interface storeHotelReqDTO {
    id: number
    thumbnail: string
    title: string
    slug: string
    visitCount: number
    user: userDTO
    status: statusObjDTO
}

export interface storeHotelSetReqDTO {
    title: string;
    slug: string;
    status_id: number;
    description: string;
    body: string;
    use_api: number;
    city_id: number;
    rooms: roomObjDTO[]
}

export interface roomObjDTO {
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
    statuses: statusesDTO[]
    cities: citiesDTO[]
}