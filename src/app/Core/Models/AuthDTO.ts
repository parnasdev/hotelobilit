export interface LoginReqDTO {
  username: string | null
  password: string | null
  temp: number
}

export interface SendCodeReqDTO {
  username: string;
  step: string;
}

export interface ChangePasswordReqDTO {
  username: string;
  token: string;
  password: string;
}

export interface RegisterReqDTO {
  username: string;
  token: string;
}

export interface ValidationResDTO {
  step: string
  type: string
  username: string
}
export interface RegisterResDTO {
  expire_at: string;
  token: string
  user: UserMeResDTO | null 
}


export interface UserMeResDTO {
  custom_route_name_access: boolean
  displayTitle: boolean
  is_access_dashboard: boolean
  is_access_panel: boolean
  is_custom: boolean
  permissions: string[]
  role: string
} 