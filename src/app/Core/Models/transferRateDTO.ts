import { CityResponseDTO } from "./cityDTO";
import { TransferListDTO } from "./transferDTO";

export interface TransferRateListReqDTO {
  departure_date: string | null;
  return_date: string | null;
  paginate: boolean;
  origin: string | null;
  dest: string | null;
}
export interface TransferRateSetReqDTO {
    origin_id : number;
    destination_id : number;
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
    is_close:  boolean;
}

export interface TransferRateListDTO {
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
  isChecked?: boolean;
  user: null
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
