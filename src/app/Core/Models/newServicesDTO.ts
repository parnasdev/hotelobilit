export interface serviceSetReq {
    hotel_id: number;
    airport_id: number;
    transfer_rate: number;
    transfer_rate_type: string;
}

export interface ServiceListRes {
    id: number;
    user: {
      id: number;
      full_name: string;
      agency_name: string;
    },
    airport_id: number
    airport: string;
    hotel_id: number
    hotel: string;
    transfer_rate: number
    transfer_rate_type: string;
}