import { Injectable } from '@angular/core';
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

    convertDateFormat(date: string) {
        return date.split('/').join('-')
    }


    changeMiladiDate(date: any, num: number | string, period: any): any {
        /* period : days or year or month */
        // date = this.convertDate(date, 'en');
        return moment(date).add(num, period).format('YYYY-MM-DD');
    }


    convertDate(date: any, convertType: string, formatEn = "YYYY/MM/DD"): any {
        /* convertType : fa - en */
        // ;
        if (convertType === 'fa') {
            return moment(date).format('jYYYY/jMM/jDD');
        } else if (convertType === 'en') {
            return moment(date).locale('en').format(formatEn);
        }
    }
    convertDateSpecial(date: any, convertType: string): any {
        /* convertType : fa - en */
        // ;
        if (convertType === 'fa') {
            return (moment(date).format('jYYYY/jMM/jDD')).split('/').join('-');
        } else if (convertType === 'en') {
            return (moment(date).locale('en').format('YYYY/MM/DD')).split('/').join('-');
        }
    }
    getDiff(start_time: string, type: any = 'minutes') {
        let duration = moment.duration(moment(start_time).diff(moment.now()));
        return { minute: duration.get(type), milliseconds: duration.asMilliseconds() };
      }
    enumerateDaysBetweenDates(startDate: string, endDate: string, format: string = 'jYYYY/jMM/jDD') {
        if (startDate && endDate) {
            var dates = [];
            var currDate = moment(startDate).startOf('day');
            var lastDate = moment(endDate).startOf('day');
            dates.push(moment(currDate.clone().toDate()).format(format));

            while (currDate.add(1, 'days').diff(lastDate) < 0) {
                dates.push(moment(currDate.clone().toDate()).format(format));
            }
            dates.push(moment(lastDate.clone().toDate()).format(format));
            return dates;
        } else {
            return [];
        }
    };


    convertDateAndTime(date: any, convertType: string): any {
        /* convertType : fa - en */
        // ;
        if (convertType === 'fa') {
            return moment(date).format('jYYYY/jMM/jDD HH:mm');
        } else if (convertType === 'en') {
            return moment(date).locale('en').format('YYYY-MM-DD HH:mm');
        }
    }

    convertDate1(date: any, convertType: string): any {
        /* convertType : fa - en */
        // ;
        if (convertType === 'fa') {
            return (moment(date).format('jYYYY/jMM/jDD HH:mm:ss')).split('/').join('-');
        } else if (convertType === 'en') {
            return (moment(date).locale('en').format('YYYY-MM-DD HH:mm:ss')).split('/').join('-');
        }
    }

    convertFullDate(date: any, convertType: string): any {
        /* convertType : fa - en */
        // ;
        if (convertType === 'fa') {
            return moment(date).locale('fa').format('DD MMM  yyyy');
        } else if (convertType === 'en') {
            return moment(date).locale('en').format('MMM DD YYYY');
        }
    }

    convertDateWithTime(date: any, convertType: string): any {
        /* convertType : fa - en */
        // ;
        if (convertType === 'fa') {
            return moment(date).format('HH:MM jYYYY/jMM/jDD');
        } else if (convertType === 'en') {
            return moment(date).locale('en').format('YYYY/MM/DD HH:MM');
        }
    }

    convertFromDate(date: any, convertType: string): any {
        return moment(date).locale(convertType).from();
    }

    changeDate(date: any, num: number | string, period: any, format: string = 'jYYYY/jMM/jDD'): any {
        /* period : days or year or month */
        // date = this.convertDate(date, 'en');
        return moment(date).add(num, period).format(format);
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
    getMonthFa(monthNum: number): any {
        switch (monthNum) {
            case 1:
                return 'فروردین';
            case 2:
                return 'اردیبهشت';
            case 3:
                return 'خرداد';
            case 4:
                return 'تیر';
            case 5:
                return 'مرداد';
            case 6:
                return 'شهریور';
            case 7:
                return 'مهر';
            case 8:
                return 'آبان';
            case 9:
                return 'آذر';
            case 10:
                return 'دی';
            case 11:
                return 'بهمن';
            case 12:
                return 'اسفند';
            default:
                return ''
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

    isValidDate(date: string, format: string = "YYYY/MM/DD ") {
        return !isNaN(new Date(date).getDate());
        // return moment(date, format, true).isValid();
    }


    // convertTime(time: string) {
    //     return moment(time).format('hh:mm')
    // }



    getPersianWeekday(labelEn: string) {
        switch (labelEn) {
            case 'saturday':
                return 'شنبه'
            case 'sunday':
                return 'یکشنبه'
            case 'monday':
                return 'دوشنبه'
            case 'tuesday':
                return 'سه شنبه'
            case 'wednesday':
                return 'چهارشنبه'
            case 'thursday':
                return 'پنج شنبه'
            case 'friday':
                return 'جمعه'
            default:
                return '---'
        }
    }
}
