import { RoomDTO } from "./newPostDTO";

export interface TourSearchReqDTO {
    destination: number;
    date: string;
    stayCount: number;
}

export interface HotelSearchResDTO {
    id: 1
    title: string;
    location: string;
    address: string;
    rooms: RoomDTO[];
    stars: 0
    gallery: any[]
    thumbnail: string
}
