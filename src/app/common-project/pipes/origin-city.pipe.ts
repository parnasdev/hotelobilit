import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'originCity'
})
export class OriginCityPipe implements PipeTransform {


  transform(list: any[], city: string): any {
    if (list.length === 0 || city === ''|| city === 'all') {
      return list;
    }
    // let _list = list.filter(item => item.tour.stCity.nameEn !== null);
    // _list = _list.filter(item => item.tour.stCity.nameEn?.indexOf(city.toLowerCase()) !== -1);
    // if (_list.length === 0) {
    //   _list = list.filter(item => item.tour.stCity.name?.indexOf(city.toLowerCase()) !== -1);
    // }
    // if (_list.length === 0) {
    //   _list = list.filter(city => city.phone.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
    // }
    // if (_list.length === 0) {
    //   _list = list.filter(city => (city.name?.toLowerCase() + ' ' + city.family?.toLowerCase()).indexOf(keyword.toLowerCase()) !== -1);
    // }
    return list.filter(item => item.tour.stCity.nameEn?.toLocaleLowerCase()?.indexOf(city?.toLocaleLowerCase()) !== -1);;
  }

}
