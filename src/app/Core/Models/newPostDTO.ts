import { UploadResDTO } from "./commonDTO";
import { hotelRates } from "./tourDTO";

export interface hotelDTO {
    id: number;
    user_id: number;
    title: string;
    titleEn: string;
    address: string;
    slug: string;
    description: string
    body: string;
    options: any;
    location: string
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
    titleEn: string
    slug: string
    visitCount: number
    currency_code: string;
    user: userDTO
    status: statusObjDTO
    rooms?: roomDTO[]
}

export interface RoomDTO {
    Adl_capacity: number
    age_child: number
    chd_capacity: number;
    room_type_id: number;
    extra_bed_count: number;
    currencies: any
    has_coefficient: boolean
    count?: number
    coefficient: number;
    transfers: {
        airport_id: number;
        transfer_rate: number;
        transfer_rate_type: string;
    }[];
    id: number;
    services: {
        airport_id: number
        category:string
        rate:number
        rate_type:string
    }[];
    rates: RateDTO[];
    online_reservation: number
    total_extra_count: number
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
    location: string | null;
    no_bed_child_ages:number[];
    with_bed_child_ages: number[];
    coordinates:number[]
    stars: number
    currency_code: string;
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
    nameEn?: string
    room_type_id: number;
    coefficient: number;
    has_coefficient?: boolean
    Adl_capacity: number;
    online_reservation?: boolean;
    is_twin_count?: boolean
    extra_bed_count?: number
    chd_capacity: number;
    room_type_en?: string
    room_type?: string;
    age_child: number;
    isSelected?: boolean
    isDisable: false;
    total_extra_count?: number;
}

export interface ReserveHotelDTO {
    address: string
    gallery: any[]
    id: number
    location: string
    services: any[]
    slug: string
    is_domestic: boolean;
    stars: string
    thumbnail: string
    title: string;
    titleEn:string
}

export interface statusObjDTO {
    name: string;
    label: string;
    color: string;
}

export interface statusesDTO {
    id: number;
    name: string;
    label:string
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
    agency_id?: number | null;
    hotelId: number;
    boardType?:string
}

export interface RatingResDTO {
    currencies: string[];
    hotel: storeHotelReqDTO;
    rates: RateDTO[];
}


export interface RateDTO {
    available_room_count: number
    created_at: string
    currency_code: string
    date: string
    deleted_at: string
    extra_bed_count: number
    extra_price: number
    total_room_count: number
    id: number
    checkin_base: boolean
    offer_extra_price: number
    chd_w_price: number;
    offer_price: number
    price: number
    room_id: number
    updated_at: string
    user_id: number
  booked_room_count:number
  reserving_room_count:number
}
export interface TourSearchDTO {

    origin: number,
    destination: number,
    date: string,
    stayCount: number
}
