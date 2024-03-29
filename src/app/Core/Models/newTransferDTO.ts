import { categoriesDTO, citiesDTO } from "./newPostDTO";

export interface transferRateDTO {
    id: number;
    user_id: number;
    origin_id: number;
    destination_id: number;
    airline_id: number;
    date: string;
    time: string;
    flight_number: string;
    adl_price: number;
    chd_price: number;
    inf_price: number;
    capacity: number;
    is_close: number;
    description: string;
    deleted_at: string;
    created_at: string;
    updated_at: string;
}

export interface transferRateListDTO {
    id: number;
    origin_name: string;
    origin_id: number;
    destination_name: string
    destination_id: number;
    airline_name: string;
  reserved_capacity: number;
    airline_id: number;
    airline_thumb: any
    cities?: any
    checkin_tomorrow?: boolean
    checkout_yesterday?: boolean
    flight: transferRateListDTO;
    date: string;
    time: string;
    flight_number: number;
    adl_price: number;
    chd_price: number;
    inf_price: number;
    user?: any
    capacity: number;
    all_capcity: number;
  booked_capacity: number
    is_close: any;
    description: string;
    checkin: string;
    checkout: string;
}

export interface SetTransferPageDTO {
    cities: citiesDTO[];
    airlines: categoriesDTO[];
}

export interface EditTransferPageDTO {
    cities: citiesDTO[];
    flight: transferRateDTO;
    airlines: categoriesDTO[];
}

export interface flightStoreDTO {
    cities: any;
    origin_id: string;
    destination_id: string;
    origin_airline_id: string;
    destination_airline_id: string;
    origin_time: string;
    destination_time: string;
    singleEdit?: boolean
    origin_flight_number: string;
    destination_flight_number: string;
    rates: flightRatesDTO[];
    checkin_tomorrow: number;
    checkout_yesterday: number
    adl_price?: number;
    origin_date?: string;
    destination_date?: string;
    chd_price?: number;
    inf_price?: number;
  capacity?: number;
}

export interface flightRatesDTO {
    adl_price: number;
    origin_date: string;
    destination_date: string;
    chd_price: number;
    inf_price: number;
    capacity: number;
}
