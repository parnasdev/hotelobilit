import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFixer'
})
export class TimeFixerPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    return value.slice(0,5);
  }

}
