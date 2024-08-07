export interface IFlightListReq {
    destination: number
    fromDate: string
    toDate: string
    status: number
    origin: number
}
export interface IFlightListRes {
    id: number;
    user: {
        id: number
        full_name: string
        agency_name: string
    };
    origin_name: string
    origin_id: number
    destination_name: string
    destination_id: number
    airline_name: string
    airline_id: number
    date: string
    time: string
    flight_number: string
    adl_price: number
    chd_price: number
    inf_price: number
    all_capacity: number
    capacity: number
    reserved_capacity: number
    booked_capacity: number
    is_close: number
    description: any;
    checkin_tomorrow: boolean;
    checkout_yesterday: boolean;
    cities: any[];
    mixed: number;
    airplane: string
    agency: string
    cabin_type: any
}

export interface IFlightCreate {
    airlines: IFlightCategory[]
    cities: IFlightCategory[]
    airports: IFlightCategory[],
    airplanes: IFlightCategory[],
    cabinTypes: string[],
    dayOfWeeks: string[]

}

export interface IFlightCategory {
    id: number;
    name: string
    thumbnail: any
}

export interface IFlightEditReq {
    origin_id: number
    destination_id: number
    airline_id: number,
    date: string
    time: string
    flight_number: string
    adl_price: number
    chd_price: number
    inf_price: number
    capacity: number
    is_close: number
sync_price?:boolean
    description: string | null
    airplane_id: number
    cabin_type: string
  baggage:string
  duration:string
}

export interface IFlightStoreReq {
    origin_id: number
    destination_id: number
    airline_id: number
    departure_flight_number: number
    return_flight_number: number
    airplane_id: number
    one_way: boolean
    departure_time: string
    return_time: string
    dates: string[],
    dayOfWeeks: string[],
    departure_duration: string
    return_duration: string
    description: string
    open_until: any
    departure_baggage: number
    return_baggage: number | null
    prices: IFlightStore[]
}
export interface IFlightStore {
    cabin_type: string
    capacity: string
    adl_price: number
    chd_price: number
    inf_price: number
}

export interface IUpdateBulk {
    ids?: number[];
    origin_id?: number,
    destination_id?: number,
    airline_id?: number,
    date?: string
    time?: string
    flight_number?: number
    adl_price?: number
    chd_price?: number
    inf_price?: number
    capacity?: number
    is_close?: number
    description?: string
    airplane_id?: number
    cabin_type?: string
  sync_price?:boolean

}

export interface IMixStepOneReq {
    request_type: string
    origin: number
    destination: number
    airline: string | null
    stay_count: string
    start_date: string | null
    end_date: string | null;
    reset: false
    checkout_yesterday?: false
    checkin_tomorrow?: false;
}
export interface IMixStepTwoReq {
    departure: {
        origin: number
        destination: number
        airline: string | null
        stay_count: string
        start_date: string
        end_date: string | null
        checkin_tomorrow: boolean
    }
    return: {
        origin: number
        destination: number
        airline: string | null
        checkout_yesterday: boolean
    }
}

export interface IMixedReq {
    ids: IMixId[]
}
export interface IMixId {
    departure_id: number
    return_id: number
    checkin_tomorrow: boolean
    checkout_yesterday: boolean;
    ignore: boolean;
}
