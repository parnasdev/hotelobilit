import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermitionsService {
  permissions: any[] = []
  constructor() { }


  check(item: string) {
    if (item === '') {
      return true
    } else {
      return this.permissions.find(x => x === item)
    }
  }

}
