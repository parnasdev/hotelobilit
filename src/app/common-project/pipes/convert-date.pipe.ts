import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'jalali-moment';

@Pipe({
  name: 'convertDate'
})
export class ConvertDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      let MomentDate = moment(value, 'YYYY/MM/DD');
      return MomentDate.locale('fa').format('YYYY/M/D');
    } else {
      return 'تاریخ موردنظر را انتخاب کنید'
    }

  }

}
