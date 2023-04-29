import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: string): number {
    if (value.length > 5){
      return Math.round(+value / 10000) * 10000;
    } else {
      return Math.round(+value / 1000) * 1000;
    }
  }


}
