import { RateDTO, ReserveHotelDTO } from "./newPostDTO";
import { transferRateListDTO } from "./newTransferDTO";

export interface ReserveCreateDTO {
    stayCount: number
    hotel_id: number;
    flight_id: number;
    rooms: ReserveReqRoomDTO[];
    reserver_full_name: string;
    checkout: string
    reserver_phone: string;
    reserver_id_code: string;
    checkin: string;

}
export interface ReserveReqRoomDTO {
    room_id: number,
    passengers: ReservePassengersDTO[]
}

export interface ReservePassengersDTO {
    name: string;
    family: string;
    id_code: string
    passport: string
    expired_passport: string
    birth_day: string
    type: string
    price?: number;
}

export interface ReserveCheckingReqDTO {
    hotel_id: number
    flight_id: number;
    checkout: string;
    checkin: string;
    stayCount: number
    rooms: ReserveRoomsReqDTO[]
}


export interface ReserveInfoDTO {
    checkin: string
    checkout: string
    flight: transferRateListDTO;
    hotel: ReserveHotelDTO
    rooms: ReserveRoomDTO[]
    rooms_selected: ReserveRoomsReqDTO[]
}

export interface ReserveRoomDTO {
    Adl_capacity: number
    age_child: number
    chd_capacity: number
    coefficient: number
    currencies: { toman: number, euro: number, dollar: number, derham: number }
    has_coefficient: boolean
    id: number
    online_reservation: number
    rates: RateDTO[]
    room_type: string
    services: {
        airport_id: number
        category: string
        rate: number
        rate_type: string
    }[];
    user: any;
    passengers?: ReservePassengersDTO[]
    options?: ReserveRoomsReqDTO;
    totalPrice?: number;
    totalExtraPrice?: number;
}
export interface ReserveRoomsReqDTO {
    room_id: number;
    count: number;
    adl_count: number;
    chd_count: number;
    chd_capacity:number
    extra_count: number;
    inf_count: number;
}

export interface ReserveListResponseDTO {
    details: {
        checkin: string;
        checkout: string
    }
    hotel: ReserveHotelDTO
    id: number
    status: {
        color: string;
        label: string;
        name: string
    }
    ref_code: string
    reserver_full_name: string
    reserver_id_code: string
    reserver_phone: string
    reserves: ReserveListChildDTO[]
    total_price: number
}

export interface ReserveListChildDTO {
    details: ReservePassengersDTO[]
    flight: transferRateListDTO
    id: number
    total_price: number
}