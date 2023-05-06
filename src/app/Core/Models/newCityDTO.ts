
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