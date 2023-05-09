import { RoomDTO } from "./newPostDTO";

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
    rooms: RoomDTO[];
    stars: number;
    gallery: any[]
    thumbnail: string
    services: string[]
}
