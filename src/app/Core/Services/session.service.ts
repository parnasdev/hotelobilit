import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { AuthApiService } from "../Https/auth-api.service";
import { UserApiService } from '../Https/user-api.service';
import { LoginResDTO, LoginResponseDTO, ProfileDTO, UserDTO, tokenResDTO } from '../Models/AuthDTO';
import { PermissionDTO } from '../Models/UserDTO';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  token = {} as tokenResDTO;
  user = {} as LoginResDTO;
  outlineApi = false;
  userPermissions: PermissionDTO[] = [];

  checkUserSubject = new BehaviorSubject('');
  checkUser$ = this.checkUserSubject.asObservable();
  constructor(public authApi: AuthApiService,
    public message: MessageService,
    public userApi: UserApiService) {
  }

  setTokenToSession(tokenObj: tokenResDTO): void {
    this.token = {
      expire_at: tokenObj.expire_at,
      token: tokenObj.token,
    }
    localStorage.setItem('hotelobilit-token', JSON.stringify(this.token));
  }

  setUserToSession(userObj: UserDTO): void {
    let token = this.getToken();
    this.user = {
      expire_at: token.expire_at,
      token: token.token,
      user: userObj
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

  getIsManager():any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.isManager : false;
  }

  checkUser() {
    // this.authApi.checkUser().subscribe((res: any) => {
    //   if (res.isDone) {
    //     this.setUserToSession({ token: this.getToken(), user: res.data });
    //     this.checkUserSubject.next('true');
    //   } else {
    //     // this.message.error();
    //     if (res.status === 401) {
    //       this.removeUser();
    //     }
    //   }
    // }, (error: any) => {
    //   // this.errorService.check(error)
    //   if (error.status === 401) {
    //     this.removeUser();
    //   }
    // });
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
    const token = localStorage.getItem('hotelobilit-token');
    return token ? JSON.parse(token).token : '';
  }

  getAgency(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.agency : '';
  }

  getIdCode():any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.id_code : '';
  }

  getId(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.id : '';
  }


  getName(): any {
    const user = localStorage.getItem('hotelobilit-user');
    return user ? JSON.parse(user).user.name : '';
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
    const user = localStorage.getItem('hotelobilit-token');
    return !!user;
  }

  removeUser(): any {
    localStorage.removeItem('hotelobilit-token');
    localStorage.removeItem('hotelobilit-user');
  }

  setOutlineApi(state: boolean): void {
    this.outlineApi = state;
  }
}
