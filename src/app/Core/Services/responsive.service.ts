import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  isMobile(): boolean {
    return window.innerWidth <= 430;
  }

  isTablet(): boolean {
    return (window.innerWidth < 867);
  }

  isDesktop(): boolean {
    return window.innerWidth > 868;
  }

  isTV(): boolean {
    return window.innerWidth > 3200;
  }
}



