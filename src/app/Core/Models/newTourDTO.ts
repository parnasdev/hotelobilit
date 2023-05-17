import { UploadResDTO } from "./commonDTO";
import { RoomDTO } from "./newPostDTO";
import { flightStoreDTO, transferRateListDTO } from "./newTransferDTO";

export interface TourSearchReqDTO {
    origin?: number
    destination: number;
    date: string;
    stayCount: number;
}

export interface HotelSearchResDTO {
    id: number;
    title: string;
    slug: string
    location: string;
    address: string;
    flights: transferRateListDTO[]
    rooms: RoomDTO[];
    stars: number;
    gallery: any[]
    thumbnail: UploadResDTO
    services: string[]
}
