import { UserDTO } from "./AuthDTO";
import { CityResponseDTO } from "./cityDTO";
import { RoomDTO, TourListResDTO, newTourPackageDTO, newTourPackageInfoDTO } from "./tourDTO";

export interface HotelSetRequestDTO {
  name: string;
  nameEn: string;
  slug: string;
  slugEn: string;
  city_id: string;
  mediaLink: MediaLinkDTO[]
  stars: number;
  location: string;
  address: string;
  rooms: any[];
  coordinate: {
    lat: number;
    lng: number
  };
  thumbnail: string;
  images: any[];
  body: string;
  services: [
    {
      name: string;
      ids: string[]
    }
  ];
  status: string
}

export interface MediaLinkDTO {
  name: string;
  link: string;
}

export interface hotelInfoDTO {
  name: string;
  city: CityResponseDTO;
  nameEn: string;
  stars: string;
  location: string;
  rooms: any[]
  address: string;
  coordinate: { lat: number, lng: number }
  images: string[];
  mediaLink: MediaLinkDTO[]
  packages?: PackageDTO[];
  thumbnail: string;
  body: string;
  services: ServicesDTO[];
  status: string;
  phone: string;
  tours: TourListResDTO[];
}

export interface hotelInfoV2DTO {
address: null;
body: string;
city: CityResponseDTO;
coordinate: {
  lat: number;
  lng: number;
};
images: string[];
images_paths: string[]
location: string
mediaLink: MediaLinkDTO[]
name: string;
nameEn: string;
packages: newTourPackageInfoDTO[];
roomPrices: any[]
services: ServicesDTO[];
stars: string;
status: string;
thumbnail: string;
thumbnail_paths:string;
}

export interface HotelListRes {
  id: number;
  name: string;
  nameEn: string;
  slug: string;
  slugEn: string;
  stars: string;
  thumbnail: string;
  city: string;
  location: string;
}

export interface HotelRequestDTO {
  isAdmin: boolean
  paginate: boolean
  perPage?: number
  hasTour?: boolean;
  city: number | string | null;
  search: string | null;
}

export interface SetHotelPackageDTO {
  title: string;
  slug: string;
  expire: string;
  city_id: string;
  transferRate: number;
  transferRateType: number;
  status: string;
  packages: PackageDTO[]
}

export interface PackageDTO {
  parent: any;
  user_id: number;
  hotel_id: string;
  services: number;
  rate: number;
  discounts: {
    twin: number;
    single: number;
    cwb: number;
    cnb: number
  };
  "prices": {
    twin: number;
    triple: number
    quad: number
    single: number;
    ADLRate: number
    cwb: number;
    cnb: number;
    age: string
  },
  "status": string

}

export interface HotelListResponseDTO {
  id: number
  name: string
  nameEn: string
  slug: string
  keyword: string
  slugEn: string
  stars: string
  thumbnail: string
  city: string
  location: string

}

export interface ServiceDTO {
  id: number;
  name: string;
  checked?: boolean;
}

export interface ServicesDTO {
  name: string;
  ids: string[]
  services: ServiceDTO[]
}

export interface hotelInfoReqDTO {
  stDate: string | null;
  night: number | null;
  isAdmin: boolean;
}


export interface HotelRatesReqDTO {
  fromDate: string;
  toDate: string;
}

export interface HotelRatesSetReqDTO {
  checkin: string;
  checkout: string;
  rate: number;
  price: number;
}

export interface HotelRatesResDTO {
  checkin: string;
  price: number
  rate: number;
  roomType: RoomTypeDTO;
  user: UserDTO
}

export interface RoomTypeDTO {
  capacityPerson: number
  id: number
  isDefault: boolean
  label: string
  name: string
}
