import { UserDTO } from "./AuthDTO";
import {  DiscountsDTO, HotelDTO, PricesDTO, TourTransferDTO } from "./tourDTO";

export interface ExportReservesReqDTO {
    fromDate: string;
    toDate: string;
    agencyId: number | null;
}


export interface PaidReserveListResDTO {
    id:           number;
    ref_code:     string;
    package:      Package;
    user:         UserDTO;
    count:        number;
    status:       string;
    passengers:   DatumPassenger[];
    bill:         Bill;
    createdAt:    string;
    transactions: Transaction[];
    agency:       any;
}

export interface Bill {
    rooms:          Room[];
    totalRoomPrice: number;
    totalPayAble:   number;
}

export interface Room {
    room_type:  string;
    room_count: number;
    room_price: number;
}

export interface Package {
    id:         number;
    tour:       Tour;
    hotel:      HotelDTO;
    services:   Services;
    rate:       Rate;
    discounts:  DiscountsDTO;
    prices:     PricesDTO;
    status:     string;
    order_item: number;
    offered:    boolean;
}


export interface Rate {
    id:   number;
    name: string;
}


export interface Services {
    id:          number;
    name:        string;
    description: string;
}


export interface Tour {
    title:      string;
    slug:       string;
    status:     string;
    transfers:  TourTransferDTO[];
    nightNum:   number;
    dayNum:     number;
    stDate:     string;
    enDate:     string;
    defineTour: boolean;
    type:       boolean;
    isTrash:    boolean;
    endCity:    CityDTO;
    stCity:     CityDTO;
}

export interface CityDTO {
    id:          number;
    name:        string;
    nameEn:      string;
    slug:        string;
    slugEn:      string;
    images:      string[];
    description: string;
    type:        boolean;
    faq:         null;
    country:     string;
}

export interface DatumPassenger {
    name:       string;
    capacity:   number;
    passengers: PassengerPassenger[];
    id:         number;
    price:      number;
    supply:     number;
}

export interface PassengerPassenger {
    firstName:       string;
    lastName:        string;
    id_code:         null | string;
    birthDate:       string;
    phoneNumber:     null | string;
    nationality:     null;
    passport_number: null | string;
    passport_expire: null | string;
}


export interface Transaction {
    id:         string;
    reserve_id: number;
    user:       UserDTO;
    amount:     number;
    resnumber:  null | string;
    bank_res:   null | string;
    expired_at: string;
    status:     string;
}