import { CityResponseDTO } from "./cityDTO";

export interface UserReqDTO {
  perPage: number;
  paginate: boolean;
}

export interface UserResDTO {
  birthDay: string;
  createdAt: string;
  family: string;
  city: CityResponseDTO
  id: number;
  name: string;
  username: string;
  phone: string;
  role: string;
}

export interface UserCreateReq {
  name: string;
  family: string;
  phone: string;
  username: string;
  password: string;
  birthDay: string;
  permissions: string[],
  role_id: number;
}

export interface UserRolesDTO {
  id: number;
  label: string;
  name: string;
  use: boolean;
}

export interface PermissionDTO {
  name: string;
  label: string;
  checked: boolean | null;
}

