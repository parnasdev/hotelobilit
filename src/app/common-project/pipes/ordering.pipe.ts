import {Pipe, PipeTransform} from '@angular/core';
import {TourListResDTO} from "../../Core/Models/tourDTO";

@Pipe({
  name: 'ordering'
})
export class OrderingPipe implements PipeTransform {

  transform(tours: TourListResDTO[], sortByDate: boolean): TourListResDTO[] {
    let data: TourListResDTO[] = [];
    tours.forEach(x => {
      data.push(x)
    })
    if (sortByDate) {
      data = data.sort((a, b) =>
        <any>new Date(a.transfers[0].dateTime) - <any>new Date(b.transfers[0].dateTime));
      return data;
    } else {
      return tours;
    }

  }

}
