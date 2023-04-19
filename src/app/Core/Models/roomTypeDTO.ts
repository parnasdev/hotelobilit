export interface RoomTypeReqDTO {
  perPage: number;
  paginate: boolean;
}

export interface RoomTypeCapacitReqDTO {
  perPage: number;
  paginate: boolean;
}

export interface RoomTypePriceDTO {
  name: string;
  price: number;
}

export interface RoomTypeListDTO {
  id: number;
  name: string;
  label: string;
  isDefault: boolean;
  capacityPerson?: number;
}

export interface RoomTypeSetDTO {
  name: string;
  label: string;
  capacityPerson: number;
}
