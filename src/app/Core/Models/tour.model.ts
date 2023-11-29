export interface ITourListRes {
    departure:   IFlight;
    return:      IFlight;
    hotel:       IHotel;
    total_price: number;
}

export interface IFlight {
    id:               number;
    origin_name:      string;
    origin_id:        number;
    destination_name: string;
    destination_id:   number;
    airline_name:     string;
    airline_id:       number;
    date:             Date;
    time:             string;
    flight_number:    string;
    adl_price:        number;
    chd_price:        number;
    inf_price:        number;
    capacity:         number;
    is_close:         boolean;
    description:      null;
    airplane:         string;
    agency:           string;
    cabin_type:       string;
    duration:         string;
    baggage:          null;
}

export interface IHotel {
    id:          number;
    title:       string;
    titleEn:     string;
    slug:        string;
    is_domestic: boolean;
    thumbnail:   IFile;
    gallery:     IFile[];
    stars:       string;
    location:    string;
    coordinates: string;
    address:     string;
    services:    IHotelService[];
    rooms:       IRoom[];
}

export interface IFile {
    id:   number;
    url:  string;
    path: string;
    type: number;
}

export interface IRoom {
    id:                 number;
    user:               IUser;
    services:           IRoomService[];
    currencies:         ICurrencies;
    room_type:          string;
    room_type_en:       string;
    room_type_id:       number;
    Adl_capacity:       number;
    chd_capacity:       number;
    total_extra_count:  number;
    extra_bed_count:    number;
    age_child:          number;
    online_reservation: boolean;
    coefficient:        number;
    has_coefficient:    boolean;
}

export interface ICurrencies {
    toman:  number;
    euro:   number;
    dollar: number;
    derham: number;
}

export interface IRoomService {
    airport_id: number;
    category:   string;
    rate:       number;
    rate_type:  string;
}

export interface IUser {
    id:          number;
    full_name:   string;
    agency_name: string;
}

export interface IHotelService {
    id:   number;
    name: string;
}