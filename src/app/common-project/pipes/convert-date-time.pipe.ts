import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'jalali-moment';

@Pipe({
  name: 'convertDateTime'
})
export class ConvertDateTimePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if(value && value !== '') {
      let MomentDate = moment(value, 'YYYY/MM/DD HH:mm');
      return MomentDate.locale('fa').format('YYYY/M/D HH:mm');
    }else {
      return '---'
    }

  }
}
