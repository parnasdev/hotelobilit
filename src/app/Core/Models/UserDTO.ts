import { CityResponseDTO } from "./cityDTO";

export interface UserReqDTO {
  perPage: number;
  paginate: boolean;
}

export interface UserResDTO {
  email: string
  email_verified_at: string
  full_name: string
  gender: string
  id: number
  image_profile: string
  last_viewed_at: string
  phone: string
  phone_verified_at: string
  role: string
  username: string
}

export interface UserCreateReq {
  agency_name: string
  agency_tell:string
  agency_address:string 
  agency_necessary_phone:string 
  name: string;
  family: string;
  phone?: string;
  edit_mode?: string
  username: string;
  role_id: number;
  password: string;
  hotels: any;
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

