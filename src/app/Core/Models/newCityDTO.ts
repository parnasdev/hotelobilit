
export interface CityListReq {
    hasFlight: number;
    hasHotel: number;
}

export interface CityListReqestDTO {
    type: number | null;
    perPage: number;
    search: string | null;
    hasOriginTour:boolean
    hasDestTour:boolean
    city?: number | null;
    hasHotel: boolean;
  }


export interface CityListRes {
    id: number;
    name: string;
    slug: string;
    code: string;
}

export interface SearchObjectDTO {
    origin: string;
    dest: string;
    stDate: string;
    night: any;
}