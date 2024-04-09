
export interface AirlineListDTO {
    id: number;
    name: string;
    useCount: number;
}

export interface AirlineReqDTO {
    name: string;
    code: string;
    del_files?: number[]
    files: any[]
}


export interface AirportReqDTO {
    parent_id: number;
    name: string;
    code: string;
    cities?:number[]
    airports?: number[]
  files?:any[]
  del_files?:any[]
}
