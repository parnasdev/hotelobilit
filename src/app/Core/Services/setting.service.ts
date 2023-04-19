import {Injectable} from '@angular/core';
import {SettingDTO} from "../Models/commonDTO";
import {SettingApiService} from "../Https/setting-api.service";
import {MessageService} from "./message.service";
import {Meta, Title} from "@angular/platform-browser";
import {PublicService} from "./public.service";
import {BehaviorSubject} from "rxjs";
import {UserApiService} from "../Https/user-api.service";
import {PermissionDTO} from "../Models/UserDTO";
import {CheckErrorService} from "./check-error.service";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  isLoading = false;
  settings: SettingDTO = {
    address: '',
    consoleGoogle: '',
    description: '',
    descriptionFooter: '',
    email: '',
    favicon: '',
    mobileBanner: '',
    mobileBanner2: '',
    banner1: '',
    banner2: '',
    location: '',
    logo: '',
    faq: '',
    isClose: false,
    logoFooter: '',
    metaTags: '',
    namads: [],
    socialLinks: '',
    tel: '',
    title: '',
    whatsapp: '',
    // footerLinks: [],
  };
  // @ts-ignore
  favIcon: HTMLLinkElement = document.querySelector('#favIcon');

  settingSub = new BehaviorSubject('');
  Setting$ = this.settingSub.asObservable();
  userPermissions: PermissionDTO[] = [];

  constructor(public settingApi: SettingApiService,
              public publicService: PublicService,
              public userApi: UserApiService,
              public titleService: Title,
              public meta: Meta,
              public checkError: CheckErrorService,
              public message: MessageService) {
  }

  getUserPermission(): void {
    this.userApi.getUserPermission().subscribe((res: any) => {
      if (res.isDone) {
        this.userPermissions = res.data;
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error();
      this.checkError.check(error);
    });

  }

  checkItemPermission(item: string) {
    return !!this.userPermissions.find(x => x.name === item)
  }


  getSetting(): void {
    this.isLoading = true
    this.settingApi.getSetting().subscribe((res: any) => {
      this.isLoading = false
      if (res.isDone) {
        this.settings = res.data
        this.setSiteSettings();
        this.settingSub.next('true');
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.isLoading = true
      this.message.error()
    })
  }

  setMetaTags() {

  }

  setSiteSettings() {
    // this.favIcon.href = this.publicService.setPrefix(this.settings.favicon);
    this.titleService.setTitle(this.settings.title);
    this.meta.addTags([
      {name: 'description', content: this.settings.description},
    ]);
  }

}
