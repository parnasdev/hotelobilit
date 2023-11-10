import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separator'
})
export class SeparatorPipe implements PipeTransform {

  transform(value: any): any {
    if(value) {
      return new Intl.NumberFormat('en').format(value);
    }else {
      return 0
    }
  }

}
