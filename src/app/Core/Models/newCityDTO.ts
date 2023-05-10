
export interface CityListReq {
    hasFlight: number;
    hasHotel: number;
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