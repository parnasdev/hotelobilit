import { UploadResDTO } from "./commonDTO";
import { hotelRates } from "./tourDTO";

export interface hotelDTO {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    description: string
    body: string;
    options: any;
    pin: boolean;
    comment: boolean;
    post_type: string;
    status_id: number;
    deleted_at: string;
    created_at: string;
    updated_at: string;
    files: any
}
export interface storeHotelReqDTO {
    id: number
    thumbnail: string
    title: string
    slug: string
    visitCount: number
    user: userDTO
    status: statusObjDTO
    rooms?: RoomDTO[]
}

export interface RoomDTO {
    Adl_capacity: number
    age_child: number
    chd_capacity: number;
    room_type_id: number;
    has_coefficient: boolean
    count?: number
    coefficient: number;
    id: number;
    rates: RateDTO[];
    online_reservation: number
    room_type: string
}

export interface InfoHotelDTO {
    statuses: statusesDTO[]
    cities: citiesDTO[]
    roomTypes: roomObjDTO[]
    post: hotelDTO;
    rooms: roomDTO[];
    files: UploadResDTO[],
    service_ids: number[],
    services: {
        id: number;
        name: string;
        isSelected?: boolean;
        thumbnail: string;
    }[]
    city_id: number;
}

export interface storeHotelSetReqDTO {
    title: string | null;
    titleEn: string | null;
    slug: string | null;
    status_id: number | null;
    del_rooms?: number[]
    address: string | null;
    stars: number
    services: number[]
    description: string | null;
    body: string | null;
    use_api: number | null;
    city_id: number | null;
    rooms: roomObjDTO[]
    options: any;
    pin: number;
    comment: number;
    files: UploadResDTO[];
    del_files: number[];
    categories: number[]
}



export interface roomObjDTO {
    id: number;
    name: string;
    room_type_id: number;
    Adl_capacity: number;
    chd_capacity: number;
    age_child: number;
}

export interface roomDTO {
    id: number;
    name: string;
    room_type_id: number;
    coefficient: number;
    has_coefficient?: boolean
    Adl_capacity: number;
    chd_capacity: number;
    room_type?: string;
    age_child: number;
    isSelected?: boolean
}

export interface ReserveHotelDTO {
    address: string
    gallery: any[]
    id: number
    location: string
    services: any[]
    slug: string
    stars: string
    thumbnail: string
    title: string
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
    code?: string
    slug?: string;
}

export interface hotelPageDTO {
    statuses: statusesDTO[];
    cities: citiesDTO[];
    roomTypes: roomDTO[]
    services: {
        id: number;
        name: string;
        isSelected?: boolean;
        thumbnail: string;
    }[]
}

export interface ratigListReqDTO {
    fromDate: string;
    toDate: string;
    roomId: number;
    hotelId: number;
}

export interface RatingResDTO {
    currencies: string[]
    hotel: storeHotelReqDTO
    rates: RateDTO[]
}


export interface RateDTO {
    available_room_count: number
    created_at: string
    currency_code: string
    date: string
    deleted_at: string
    extra_bed_count: number
    extra_price: number
    id: number
    offer_extra_price: number
    offer_price: number
    price: number
    room_id: number
    updated_at: string
    user_id: number
}
export interface TourSearchDTO {

    origin: number,
    destination: number,
    date: string,
    stayCount: number
}