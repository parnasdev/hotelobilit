
export interface AirlineListDTO {
    id: number;
    name: string;
    useCount: number;
}

export interface AirlineReqDTO {
    name: string;
    code: string;
    files: any[]
}


export interface AirportReqDTO {
    parent: number;
    name: string;
    code: string;
    files: any[]
}