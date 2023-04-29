import { Pipe, PipeTransform } from '@angular/core';
import {TourListResDTO} from "../../Core/Models/tourDTO";

@Pipe({
  name: 'tourStatusFilter'
})
export class TourStatusFilterPipe implements PipeTransform {

  transform(list: TourListResDTO[], status: string): any {
    if (!list || status === 'All') {
      return list;
    }else {
      return list.filter(tour => tour.status === status);
    }
  }
}
