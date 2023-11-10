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
    description: string | null
    airplane_id: number
    cabin_type: string
}

export interface IFlightStoreReq {
    origin_id: number
    destination_id: number
    airline_id: number
    departure_flight_number: number
    return_flight_number: number
    airplane_id: number
    departure_time: string
    return_time: string
    dates: string[],
    dayOfWeeks: string[],
    departure_duration: string
    return_duration: string
    description: string
    open_until: any
    departure_baggage: number
    return_baggage:number
    prices: IFlightStore[]
}
export interface IFlightStore {
    cabin_type: string
    capacity: string
    adl_price: number
    chd_price: number
    inf_price: number
}

export interface updateBulk {
    ids: number[];
    capacity:number
}