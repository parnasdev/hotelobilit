
export interface AirlineListDTO {
    id: number;
    name: string;
    useCount: number;
}

export interface AirlineReqDTO {
    name: string;
    code: string;
    files: []
}