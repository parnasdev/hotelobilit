import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BirthDateDataService {
  years: number[] = [];
  days: number[] = [];
  monthsFa: string[] = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند']
  monthEn = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

getMonthEnNumber(month: string) {
  switch (month) {
    case 'January':
      return '01';
    case 'February':
      return '02';
    case 'March':
      return '03';
    case 'April':
      return '04';
    case 'May':
      return '05';
    case 'June':
      return '06';
    case 'July':
      return '07';
    case 'August':
      return '07';
    case 'September':
      return '09';
    case 'October':
      return '10';
    case 'November':
      return '11';
    case 'December':
      return '12';
    default:
      return '--'
  }

}


  generateYear(lang = 'fa') {
    this.years = []
    if (lang == 'fa') {
      for (let i = 1299; i < 1402; i++) {
        this.years.push(i);
      }
    } else {
      for (let i = 1900; i < 2023; i++) {
        this.years.push(i);
      }
    }
  }

  generateDay() {
    this.days=[]
    for (let i = 1; i <= 31; i++) {
      this.days.push(i);
    }
  }


  getDayLabel(day: number) {
    if (day < 10) {
      return '0' + day
    } else {
      return day
    }
  }


  getMonthFaNumber(month: string) {
    switch (month) {
      case 'فروردین':
        return '01';
      case 'اردیبهشت':
        return '02';
      case 'خرداد':
        return '03';
      case 'تیر':
        return '04';
      case 'مرداد':
        return '05';
      case 'شهریور':
        return '06';
      case 'مهر':
        return '07';
      case 'آبان':
        return '07';
      case 'آذر':
        return '09';
      case 'دی':
        return '10';
      case 'بهمن':
        return '11';
      case 'اسفند':
        return '12';
      default:
        return '--'
    }

  }
}
