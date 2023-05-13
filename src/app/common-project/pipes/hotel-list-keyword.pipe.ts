import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hotelListKeyword'
})
export class HotelListKeywordPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
