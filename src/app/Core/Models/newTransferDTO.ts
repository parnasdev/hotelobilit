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
    airline_id: number;
    date: string;
    time: string;
    flight_number: number;
    adl_price: number;
    chd_price: number;
    inf_price: number;
    capacity: number;
    is_close: number;
    description: string;
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
    origin_id: number;
    destination_id: number;
    airline_id: number;
    date: number;
    time: string;
    flight_number: number
    adl_price: number;
    chd_price: number;
    inf_price : number;
    capacity: number;
    is_close : number;
    description : string;
}