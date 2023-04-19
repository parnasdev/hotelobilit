import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor() {
  }

  getDefaultHeaders(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      })
    };
  }

  substringText(count: number, str: string): string {
    if (str) {
      if (str.length > count) {
        return str.substring(0, count) + '...';
      } else {
        return str;
      }
    } else {
      return '';
    }
  }

  getStatus(statusEn: string): string {
    switch (statusEn) {
      case 'NewReserve':
        return 'درخواست جدید';
      case 'Completion':
        return 'در حال تکمیل';
      case 'Accepted':
        return 'تایید شده';
      case 'NotAccepted':
        return 'تایید نشده';
      case 'Pending':
        return 'در انتظار';
      case 'Suspended':
        return 'معلق شده';
      case 'Show':
        return 'نمایش';
      case 'Draft':
        return 'پیش نویس';
      case 'NewTicket':
        return 'تیکت جدید';
      case 'ExpertAnswerTicket':
        return 'پاسخ کارشناس به تیکت';
      case 'UserAnswerTicket':
        return 'پاسخ تیکت کاربر';
      case 'ExpertCheckingTicket':
        return 'بررسی تیکت کارشناس';
      case 'closeTicket':
        return 'بستن تیکت';
      case 'NewReserve':
        return 'رزرو جدید';
      case 'PenddingAccept':
        return 'منتظر تایید آژانس';
      case 'Paid':
        return 'پرداخت شده';
      case 'PenddingPay':
        return 'منتظر پرداخت';
        case 'Completed' :
          return 'تکمیل شده'
      default:
        return ''
    }
  }



fixNumbers(str: any): string {
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const EnglishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];
  if (typeof str === 'string') {
    for (let i = 0; i <= str.length; i++) {
      str = str.replace(persianNumbers[i], i).replace(EnglishNumbers[i], i);
    }
  }
  return str;
}

setPrefix(image: string | null): string {
  return 'https://hotelobilit.com/panel/' + image;
}

openPage(address: string) {
  const url = 'https://hotelobilit.com/' + address
  window.open(url, "_blank");
}
}
