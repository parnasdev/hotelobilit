import { UploadResDTO } from "./commonDTO";
import { RoomDTO } from "./newPostDTO";
import { transferRateListDTO } from "./newTransferDTO";
import { ReserveRoomsReqDTO } from "./reserveDTO";

export interface TourSearchReqDTO {
  origin?: string | null
  destination: string | null;
  date: string | null;
  stayCount: number | null;
  keywords?: string | null
  stars?: number | null
  orderBy?: number | null
}

export interface HotelSearchResDTO {
  id: number;
  title: string;
  titleEn: string;
  slug: string
  location: string;
  address: string;
  flights: transferRateListDTO[]
  rooms: RoomDTO[];
  totalRoomPrice?: any
  is_domestic: boolean
  stars: number;
  gallery: any[]
  thumbnail: UploadResDTO
  services: any[]
}
export interface ChooseTourListDTO {
  id: number;
  origin_name: string;
  origin_id: number;
  destination_name: string
  destination_id: number;
  airline_name: string;
  airline_id: number;
  airline_thumb: any
  flight: transferRateListDTO;
  date: string;
  time: string;
  flight_number: number;
  adl_price: number;
  chd_price: number;
  inf_price: number;
  capacity: number;
  is_close: number;
  description: string;
  rooms: RoomDTO[];
  selectedRooms: ReserveRoomsReqDTO[]
  checkin: string;
  checkout: string;
}