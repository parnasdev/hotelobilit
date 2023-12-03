export interface ITourListRes {
    departure: IFlight;
    return: IFlight;
    hotel: IHotel;
    total_price: number;
}

export interface IFlight {
    id: number;
    origin_name: string;
    origin_id: number;
    destination_name: string;
    destination_id: number;
    airline_name: string;
    airline_id: number;
    date: Date;
    airline_logo: IFile;
    time: string;
    flight_number: string;
    adl_price: number;
    chd_price: number;
    inf_price: number;
    capacity: number;
    is_close: boolean;
    description: null;
    airplane: string;
    agency: string;
    cabin_type: string;
    duration: string;
    baggage: null;
}

export interface IHotel {
    id: number;
    title: string;
    titleEn: string;
    slug: string;
    is_domestic: boolean;
    checkin: string;
    checkout: string;
    thumbnail: IFile;
    gallery: IFile[];
    stars: string;
    location: string;
    coordinates: string;
    address: string;
    services: IHotelService[];
    rooms: IRoom[];
}

export interface IFile {
    id: number;
    url: string;
    path: string;
    type: number;
}

export interface IRoom {
    room_id: number;
    user: IUser;
    services: IRoomService[];
    currencies: ICurrencies;
    room_type: string;
    room_type_en: string;
    room_type_id: number;
    Adl_capacity: number;
    chd_capacity: number;
    total_extra_count: number;
    extra_bed_count: number;
    count?: number;
    age_child: number;
    online_reservation: boolean;
    coefficient: number;
    has_coefficient: boolean;
    rate: {
        available_room_count: number
        chd_price: number
        extra_bed_count: number
        extra_price: number
        price: number
    }
    chd_count?: number
    inf_count?: number
    extra_count?: number
    adl_count?: number
}

export interface ICurrencies {
    toman: number;
    euro: number;
    dollar: number;
    derham: number;
}

export interface IRoomService {
    airport_id: number;
    category: string;
    rate: number;
    rate_type: string;
}

export interface IUser {
    id: number;
    full_name: string;
    agency_name: string;
}

export interface IHotelService {
    id: number;
    name: string;
}


export interface ITourListReq {
    origin: string,
    destination: string,
    date: string
    stayCount: number
    stars?: any
    keywords?: string

}

export interface ISearchDataRes {
    destinations?: ISearchDataRes[];
    dates?: IDatesRes[];
    id: number;
    name: string;
    code: string;
}

export interface IDatesRes {
    date: string;
    nights: number[];
}

export interface ITourInfoRes {
    flights: {
        departure: IFlight;
        return: IFlight;
        selectedRooms?: IRoom[]
        rooms: IRoom[]
    }[]
    hotel: IHotel;
    rooms: IRoom[]

}





export interface ITourShowReserve {
    information: Information;
    prices: IPrices;
    hotel: IReserveHotel;
    flights: IFlights;
    selected_rooms: ISelectedRoom[];
}

export interface IFlights {
    departure: IFlight;
    return: IFlight;
}


export interface IReserveHotel {
    id: number;
    title: string;
    titleEn: string;
    slug: string;
    checkin: string;
    checkout: string;
    is_domestic: boolean;
    thumbnail: IFile;
    gallery: IFile[];
    stars: string;
    location: string;
    coordinates: string;
    address: string;
    services: HotelService[];
}

export interface HotelService {
    id: number;
    name: string;
}

export interface Information {
    id: number;
    ref_code: string;
    reserver: IReserverInfo;
    expired_in_minutes: string;
    status: IStatus;
}

export interface IReserverInfo {
    full_name: null;
    phone: null;
    id_code: null;
}

export interface IStatus {
    name: string;
    label: string;
    color: string;
}

export interface IPrices {
    total_price: number;
    departure_total_price: number;
    return_total_price: number;
    Double_1_total_price: number;
}

export interface ISelectedRoom {
    info_room: InfoRoom;
    passengers: IPassenger[];
    reserve_id: number
}

export interface InfoRoom {
    id: number;
    user: IUser;
    services: IinfoRoomService[];
    room_type: string;
    room_type_en: string;
    room_type_id: number;
    Adl_capacity: number;
    chd_capacity: number;
    total_extra_count: number;
    extra_bed_count: number;
    age_child: number;
    online_reservation: boolean;
    coefficient: number;
    has_coefficient: boolean;
}

export interface IinfoRoomService {
    airport_id: number;
    category: string;
    rate: number;
    rate_type: string;
}

export interface IUser {
    id: number;
    full_name: string;
    agency_name: string;
}

export interface IPassenger {
    name: string;
    family: string;
    id_code: string;
    passport: string;
    gender: number;
    expired_passport: string;
    nationality: number;
    birth_day: string;
    type: string;
    room_price: number;
    departure_flight_rate: number;
    return_flight_rate: number;
    total_room_price: number;
}
