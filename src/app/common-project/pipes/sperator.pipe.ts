import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sperator'
})
export class SperatorPipe implements PipeTransform {

  transform(value: any): any {
    return new Intl.NumberFormat('en').format(value);
  }

}
