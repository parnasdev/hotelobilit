import { RateDTO, ReserveHotelDTO } from "./newPostDTO";
import { transferRateListDTO } from "./newTransferDTO";

export interface ReserveCreateDTO {
    stayCount: number
    hotel_id: number;
    flight_id: number;
    rooms: ReserveReqRoomDTO[];
    reserver_full_name: string;
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
}

export interface ReserveCheckingReqDTO {
    hotel_id: number
    flight_id: number;
    checkin: string;
    stayCount: number
    rooms: { room_id: number, count: number }[]
}


export interface ReserveInfoDTO {
    flight: transferRateListDTO;
    hotel: ReserveHotelDTO
    rooms: ReserveRoomDTO[]
    rooms_selected: { room_id: number, count: number }[]
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
    rates: RateDTO    
    room_type: string
    services: { insurance_rate: number, transfer_rate: number, visa_rate: number }
    user: any;
    passengers?: ReservePassengersDTO[]
}