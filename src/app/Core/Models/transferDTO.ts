export interface TransferListRequestDTO {
  perPage: number;
  paginate: boolean;
  search: any;
  type: number
}
export interface TransferSetRequestDTO {
  name: string;
  logo: string;
  type: number;
}

export interface TransferListDTO {
  name: string;
  id: number;
  createdAt: string;
  logo: string;
  type: {
    id: number;
    name: string;
  }
}
