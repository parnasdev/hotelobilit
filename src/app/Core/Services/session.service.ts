import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { AuthApiService } from "../Https/auth-api.service";
import { UserApiService } from '../Https/user-api.service';
import { PermissionDTO } from '../Models/UserDTO';
import { MessageService } from './message.service';
import { RegisterResDTO, UserMeResDTO } from '../Models/AuthDTO';

@Injectable({
  providedIn: 'root'
})
export class SessionService {


  user: RegisterResDTO = {
    expire_at: '',
    token: '',
    user: {
      custom_route_name_access: false,
      displayTitle: false,
      is_access_dashboard: false,
      is_access_panel: false,
      is_custom: false,
      permissions: [],
      role: ''
    }
  };
  outlineApi = false;
  userPermissions: PermissionDTO[] = [];
  checkUserSubject = new BehaviorSubject('');
  checkUser$ = this.checkUserSubject.asObservable();
  constructor(public authApi: AuthApiService,
    public message: MessageService,
    public userApi: UserApiService) {
  }

  setTokenToSession(tokenObj: any): void {
    this.user = {
      expire_at: tokenObj.expire_at,
      token: tokenObj.token,
      user: null
    }
    localStorage.setItem('hotelobilit-user', JSON.stringify(this.user));
  }

  setUserToSession(user: UserMeResDTO): void {
    this.user = {
      expire_at: this.getExpireAt(),
      token: this.getToken(),
      user: user
    }
    localStorage.setItem('hotelobilit-user', JSON.stringify(this.user));
  }

  getUserPermission(): void {
    // this.userApi.getUserPermission().subscribe((res: any) => {
    //   if (res.isDone) {
    //     this.userPermissions = res.data;
    //   } else {
    //     this.message.custom(res.message);
    //   }
    // }, (error: any) => {
    //   this.message.error();
    // });
    const user = localStorage.getItem('hotelobilit-user');
    this.userPermissions = user ? JSON.parse(user).user.permissions : '';
  }

  checkPermission(item: string) {
    return !!this.userPermissions.find(x => x.name.split('.')[0] === item)
  }

  checkItemPermission(item: string) {
    return !!this.userPermissions.find(x => x.name === item)
  }

  getIsManager(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.isManager : false;
  }


  isCompletedAgencyProfile() {
    return this.isEmpty(this.getAgency())
  }

  isEmpty(obj: any): any {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  getToken(): any {
    const token = localStorage.getItem('hotelobilit-user');
    if (token && JSON.parse(token)) {
      return JSON.parse(token).token
    } else {
      return '';

    }
  }

  getExpireAt(): any {
    const token = localStorage.getItem('hotelobilit-user');
    if (token && JSON.parse(token)) {
      return JSON.parse(token).expire_at
    } else {
      return '';

    }
  }

  getAgency(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.agency : '';
  }


  getId(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.id : '';
  }


  getName(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.displayTitle : '';
  }

  getUsername(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.username : '';
  }


  getPhone(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.phone : '';
  }

  getFamily(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.family : '';
  }
  getAgencyName(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.agency?.name : '';
  }

  getAgencyVerified(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.agency?.verify : false;
  }

  getAgencyCommission(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? (JSON.parse(user).user.agency ? JSON.parse(user).user.agency?.commission : 0) : 0;
  }
  getAgencyIsManager(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? (JSON.parse(user).user.agency ? JSON.parse(user).user.agency?.isManager : false) : false;
  }

  getBirthday(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.birthDay : '';
  }

  getRole(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.role : '';
  }

  isLoggedIn(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return !!user;
  }

  removeUser(): any {
    localStorage.removeItem('hotelobilit-user');
    localStorage.removeItem('hotelobilit-user');
  }

  setOutlineApi(state: boolean): void {
    this.outlineApi = state;
  }
}
