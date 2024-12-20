import { CityDTO, CityResponseDTO } from "./cityDTO";
import { RoomTypeDTO, ServicesDTO } from "./hotelDTO";
import { RoomTypePriceDTO } from "./roomTypeDTO";
import { UserResDTO } from "./UserDTO";


export interface TourListRequestDTO {
  origin: string | null;
  dest: string | null;
  stDate: string | null;
  night: number | string | null;
  status: string | null;
  perPage: number;
  paginate: boolean;
  search: string | null;
  isAdmin?: boolean | null;
  month?: string | null;
  type: number | null;
  sortByDate: boolean;
  limit?: number;
  offered?: boolean;
}

export interface TourRequestV2DTO {
  paginate: boolean
  origin: string;
  search?: string | null;
  star: null | number;
  dest: string;
  stDate: string;
  night: number | null;
}

export interface TourListResDTO {
  checkin: string;
  checkout: string
  day_num: number
  destination_id: number
  destination_name: string
  expired_at: string
  id: number
  night_num: number
  origin_id: number
  origin_name: string
  status: any
  title: string
  is_bundle:boolean
  tour_type: boolean
  user: {
    agency_name: string
    full_name: string
    id: number
  };
}

export interface TourSetRequestDTO {
  title: string;
  slug: string;
  stCity_id: string;
  endCity_id: string;
  nightNum: number;
  dayNum: number;
  offered: boolean;
  transferType: number;
  // transfers: TourTransferDTO[];
  transferIds: number[];
  enDate: string;
  stDate: string
  expireDate: string;
  type: boolean
  CHDFlightRate: number;
  ADLFlightRate: number;
  defineTour: boolean;
  euroRate: number;
  dollarRate: number;
  AEDRate: number;
  visaRate: number;
  visaPriceType: number;
  insuranceRate: number;
  transferPriceType: number;
  transferRate: number;
  insurancePriceType: number;
  services: string;
  documents: string;
  description: string;
  status: string;
  packages: TourPackageDTO[];
}

export interface TourInfoDTO {
  AEDRate: number;
  CHDFlightRate: string;
  ADLFlightRate: string;
  transferType: string;
  dayNum: number;
  defineTour: boolean;
  description: string;
  documents: string;
  dollarRate: number;
  enDate: string;
  endCity: CityTourInfoDTO;
  euroRate: number;
  expireDate: string;
  insurancePriceType: number;
  insuranceRate: number;
  nightNum: number;
  offered: boolean
  packages: TourPackageDTO[];
  services: string;
  slug: string;
  stCity: CityTourInfoDTO;
  stDate: string;
  status: string;
  title: string;
  transfers: TourTransferDTO[];
  newTransfers: [];
  transferPriceType: number;
  transferRate: number;
  type: boolean;
  user: {
    name: string;
    family: string;
    agency: string;
  }
  visaPriceType: number;
  visaRate: number;
  tours: TourListResDTO[];
  minPrice: string;
  viewCount: number;
}

export interface TourPackageDTO {
  parent: null;
  user_id: null;
  offered: boolean;
  order_item: number;
  id: number;
  hotel_id: string;
  services: {
    id: number;
    name: string;
  };
  hotel: HotelDTO;
  rate: { id: number, name: string };
  roomType: RoomTypePriceDTO[];
  discounts: DiscountsDTO;
  prices: PricesDTO;
  status: string;
}

export interface TourPackageV2DTO {
  discounts: DiscountsDTO;
  hotel: HotelDTO;
  id: number;
  offered: boolean;
  order_item: number;
  prices: PricesDTO;
  rate: { id: number, name: string };
  services: {
    id: number;
    name: string;
  };
  status: string;
  tour: TourListResDTO;
}

export interface HotelDTO {
  id: number;
  name: string;
  nameEn: string;
  slug: string;
  slugEn: string;
  stars: string;
  thumbnail: string;
  location: string;
}

export interface DiscountsDTO {
  twin: number;
  single: number;
  cwb: number;
  cnb: number;
}

export interface PricesDTO {
  twin: string;
  single: string;
  cwb: string;
  cnb: string;
  quad: string;
  triple: string;
  twinCapacity: string;
  singleCapacity: string;
  cwbCapacity: string;
  quadCapacity: string;
  tripleCapacity: string;
  twinRate: string;
  singleRate: string;
  cwbRate: string;
  cnbRate: string;
  quadRate: string;
  roomType: RoomTypePriceDTO[];
  tripleRate: string;
  ADLRate: string;
  age: string;
  pool?: boolean;
}

export interface TourTransferDTO {
  transfer_id: string;
  dateTime: string;
  flightCode: string;
  jDateTime?: string;
  transfer?: string;
  type: string;
}

export interface CityTourInfoDTO {
  id: number;
  name: string;
  slug: string;
  slugEn: string;
  images: any[];
  description: string;
  type: boolean
}

export interface ReserveReqDTO {
  package_id: number | null;
  phone?: string;
  count?: number;
  month?: string;
  city_id?: string;
  noPackage?: boolean;
}

export interface ReserveListReqDTO {
  perPage?: number;
  paginate: boolean;
  agencyName?: string;
  refCode?: string;
  date?: string;
  search?: string;
  status?: string;
  accountType?: string | null;
}

export interface ReserveListResDTO {
  id: number;
  count: number;
  package: ReservePackageDTO;
  phone: string;
  city: CityResponseDTO;
  createdAt: string;
  month: string;
  name: string;
  status: string | null;
}

export interface UserReserveListResDTO {
  bill: BillDTO
  count: number
  createdAt: string
  id: number
  month: null
  name: null
  package: ReservePackageDTO;
  passengers: null
  status: string
  ref_code: string;
  transactions: any;
}

export interface ReservePackageDTO {
  id: number;
  tour: newTourDTO;
  hotel: HotelDTO;
  services: RateDTO;
  rate: RateDTO;
  discounts: DiscountsDTO;
  prices: PricesDTO;
  status: string;
  order_item: number;
  offered: boolean;
}

export interface RateDTO {
  id: number;
  name: any;
}

export interface Tour {
  dayNum: number | string
  enDate: string
  endCity: CityResponseDTO
  nightNum: number
  slug: string
  stCity: CityResponseDTO
  stDate: string
  status: string
  title: string
  transfers: TourTransferDTO[]
  defineTour: boolean
  type?: boolean
}


export interface DatesResDTO {
  date: string;
  night: number;
  checkin_tomorrow: boolean
  checkout_yesterday: boolean
}



export interface ReserveInfoDTO {
  id: number;
  agency: string;
  agencyPercent: number;
  package: ReservePackageDTO;
  user: any;
  ref_code?: string
  count: number;
  status: string;
  passengers: RoomDTO[];
  bill: BillDTO;
  transactions: any[];
  transfer?: newTransfersDTO,
  createdAt: string;
}

export interface BillDTO {
  rooms: RoomsRequestDTO[];
  totalRoomPrice: number;
  totalPayAble: number;
}

export interface RoomsRequestDTO {
  room_type: string
  room_count: number
  room_price: number
}

export interface PassengerDTO {
  firstName: string;
  lastName: string;
  id_code: string;
  birthDate: string;
  type?: any
  phoneNumber: string;
  nationality: string;
  passport_number: string;
  passport_expire: string;
}

export interface RoomPassengersDTO {
  roomName: string | undefined;
  passengers: PassengerDTO[];
}

export interface ReserveRoomDTO {
  allCapacity: number;
  roomType: string;
  roomCount: number;
  capacityPerson: number;
}

export interface EditReserveReq {
  city_id: number;
  phone: string;
  name: string;
  isEditPassenger?: boolean;
  family: string;
  id_code: number;
  count: number;
  coupon_id: string;
  passengers: RoomDTO[];
  bill: BillDTO;
  changeHotel: number; // 0 or 1
  package_id: string | null;
}

export interface RoomDTO {
  id: number
  name: string;
  capacity: number;
  passengers: PassengerDTO[]
  price: number;
  supply: number
}

export enum BoardType {
  BB='B.B',
  FB='F.B',
  ALL='ALL',
  UALL='UALL'
}

export interface TourSetDTO {
  title: string;
  origin_id: number
  is_bundle?:boolean
  currencies?:string
  is_online?:boolean
  del_packages?:number[]
  del_rooms?:any[]
  destination_id: number
  night_num: number
  partnerIds: any[]
  day_num: number
  tour_type: number
  checkin: string
  checkout: string
  expired_at: string
  status_id: number
  flights: number[]
  packages: PackageTourDTO[]
  description:string
  service:string
  documents:string
  offered:boolean
}

export interface PackageTourDTO {
  hotel_id: number;
  order_item: number;
  isChecked?:boolean
  provider_id?: number;
  board_type?: string;
  id?: number;
  offered: boolean;
  "cwb"?: string;
  old_hotel_id?: number;
  "child_age"?:string;
  rooms?:any[]
  del_rooms?:number[];
}

export interface newTourDTO {
  agency: string;
  dayNum: number;
  defineTour: boolean;
  enDate: string;
  endCity: CityResponseDTO;
  stCity: CityResponseDTO;
  isTrash: number;
  newTransfers: newTransfersDTO[]
  nightNum: number;
  slug: string;
  stDate: string;
  status: string;
  title: string;
  transfers: any[];
  type: boolean;
}

export interface TransferDTO {
  id: number;
  logo: string;
  logo_path: string;
  name: string;
  type: { id: number, name: string }
}

export interface newTourPackageInfoDTO {
  id: number;
  hotel_id: number;
  order_item: number;
  offered: boolean;
  services: string;
  rate: number;
  prices: PricesDTO;
  status: string;
  tour: newTourDTO;
}

export interface newTourPackageDTO {
  id?: number;
  hotel_id: number;
  order_item: number;
  offered: boolean;
  hotel_slug: string;
  services: string;
  rate: number;
  prices: PricesDTO;
  status: string;
  tour?: newTourDTO;
}


export interface newTransfersDTO {
  adl_price: number
  capacity: number
  chd_price: number
  departure_date: string;
  departure_time: string;
  destination: CityDTO;
  destination_transfer: TransferDTO;
  destination_transfer_number: string;
  id: number
  inf_price: number
  is_close: boolean
  origin: CityDTO
  origin_transfer: TransferDTO;
  origin_transfer_number: string;
  return_date: string;
  return_time: string;
  user: null
}

export interface hotelRates {
  checkin: string;
  price: number
  capacity: number
  rate: number
  roomType: RoomTypeDTO
}


export interface addRequestReserveDTO {
  origin: string;
  destination: string;
  phone: string;
}

export interface getRequestReserveDTO {
  createdAt: string;
  message: string;
  decodeMessage: decodeMessageDTO;
  user: {
    name: string;
    family: string;
  }
}

export interface decodeMessageDTO {
  origin: string;
  destination: string;
  phone: string;
}
