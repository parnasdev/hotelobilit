import {Injectable} from '@angular/core';
import * as moment from 'jalali-moment';


@Injectable({
    providedIn: 'root',
})
export class CalenderServices {
    constructor() {
    }

    convertTime(val: string): any {
        return val.slice(0, 5);
    }

    convertDate(date: any, convertType: string,formatEn = "YYYY/MM/DD"): any {
        /* convertType : fa - en */
        // debugger;
        if (convertType === 'fa') {
            return moment(date).format('jYYYY/jMM/jDD');
        } else if (convertType === 'en') {
            return moment(date).locale('en').format(formatEn);
        }
    }
    convertDateSpecial(date: any, convertType: string): any {
      /* convertType : fa - en */
      // debugger;
      if (convertType === 'fa') {
        return (moment(date).format('jYYYY/jMM/jDD')).split('/').join('-');
      } else if (convertType === 'en') {
        return (moment(date).locale('en').format('YYYY/MM/DD')).split('/').join('-');
      }
    }



    convertDateAndTime(date: any, convertType: string): any {
        /* convertType : fa - en */
        // debugger;
        if (convertType === 'fa') {
            return moment(date).format('jYYYY/jMM/jDD HH:mm');
        } else if (convertType === 'en') {
            return moment(date).locale('en').format('YYYY-MM-DD HH:mm');
        }
    }

    convertDate1(date: any, convertType: string): any {
      /* convertType : fa - en */
      // debugger;
      if (convertType === 'fa') {
        return (moment(date).format('jYYYY/jMM/jDD HH:mm:ss')).split('/').join('-');
      } else if (convertType === 'en') {
        return (moment(date).locale('en').format('YYYY-MM-DD HH:mm:ss')).split('/').join('-');
      }
    }

    convertFullDate(date: any, convertType: string): any {
        /* convertType : fa - en */
        // debugger;
        if (convertType === 'fa') {
            return moment(date).locale('fa').format('DD MMM  yyyy');
        } else if (convertType === 'en') {
            return moment(date).locale('en').format('MMM DD YYYY');
        }
    }

    convertDateWithTime(date: any, convertType: string): any {
        /* convertType : fa - en */
        // debugger;
        if (convertType === 'fa') {
            return moment(date).format('HH:MM jYYYY/jMM/jDD');
        } else if (convertType === 'en') {
            return moment(date).locale('en').format('YYYY/MM/DD HH:MM');
        }
    }

    convertFromDate(date: any, convertType: string): any {
        return moment(date).locale(convertType).from();
    }

    changeDate(date: any, num: number | string, period: any): any {
        /* period : days or year or month */
        // date = this.convertDate(date, 'en');
        return moment(date).add(num, period).format('jYYYY/jMM/jDD');
    }

    getWeekDay(date: string): any {
        // input example : 2019/02/01
        const inCommingDate = new Date(date);
        const day = inCommingDate.getDay();
        switch (day) {
            case 0:
                return 'یکشنبه';
            case 1:
                return 'دوشنبه';
            case 2:
                return 'سه شنبه';
            case 3:
                return 'چهار شنبه';
            case 4:
                return 'پنج شنبه';
            case 5:
                return 'جمعه';
            case 6:
                return 'شنبه';
        }
    }

    calculateDuration(date1: any, date2: any): any {
        const a = moment(date1, 'YYYY/MM/DD');
        const b = moment(date2, 'YYYY/MM/DD');
        return b.diff(a, 'days');
    }

    calculate_isBetween(before: any, myTime: any, after: any): any {
        let format = 'hh:mm:ss';

        // var time = moment() gives you current time. no format required.
        let time = moment(myTime, format),
            beforeTime = moment(before, format),
            afterTime = moment(after, format);

        if (time.isBetween(beforeTime, afterTime)) {
            return true;
        } else {
            return false;
        }
    }

    isValidDate(date: string, format:string = "YYYY/MM/DD "){
        return !isNaN(new Date(date).getDate());
        // return moment(date, format, true).isValid();
    }

}
