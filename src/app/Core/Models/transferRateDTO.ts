import { CityResponseDTO } from "./cityDTO";
import { TransferListDTO } from "./transferDTO";

export interface TransferRateListReqDTO {
  hotelCheckin: string | null;
  hotelCheckout: string | null;
  paginate: boolean;
  origin: string | null;
  dest: string | null;
}
export interface TransferRateSetReqDTO {
  origin_id: number;
  destination_id: number;
  origin_transfer_id: number;
  destination_transfer_id: number;
  departure_date: string;
  return_date: string;
  departure_time: string;
  return_time: string;
  origin_transfer_number: string;
  destination_transfer_number: string;
  adl_price: string;
  chd_price: string;
  inf_price: string;
  capacity: string;
  is_close: boolean;
}

export interface TransferRateListDTO {
  adl_price: number
  airline_id: number
  airline_name: string
  capacity: number
  chd_price: number
  checkin_tomorrow: boolean
  checkout_yesterday: boolean
  cabin_type:string
  cities: number[]
  date: string;
  description: null | string
  destination_id: number
  destination_name: string
  flight: TransferRateListDTO
  flight_number: string
  id: number
  inf_price: number
  is_close: number
  return_flight:any
  origin_id: number
  origin_name: string
  reserve_capacity: number
  time: string
  user: any
  isChecked?: boolean;
}

export interface TransferRateDTO {
  id: number;
  adl_price: number;
  capacity: number;
  chd_price: number;
  departure_date: string;
  departure_time: string;
  destination: CityResponseDTO;
  destination_transfer: TransferListDTO;
  destination_transfer_number: string;
  inf_price: number;
  is_close: false;
  origin: CityResponseDTO;
  origin_transfer: TransferListDTO;
  origin_transfer_number: string;
  return_date: string;
  return_time: string;
  user: null
}
