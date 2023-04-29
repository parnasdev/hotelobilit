import { Pipe, PipeTransform } from '@angular/core';
import { CityResponseDTO } from 'src/app/Core/Models/cityDTO';

@Pipe({
  name: 'cityKeyword'
})
export class CityKeywordPipe implements PipeTransform {




  transform(list: CityResponseDTO[], keyword: string): any {
    if (list.length === 0 || !keyword) {
      return list;
    }
    let _list = list.filter(city => city.name !== null);
    _list = _list.filter(city => city.name?.indexOf(keyword.toLowerCase()) !== -1);
    if (_list.length === 0) {
      _list = list.filter(city => city.nameEn?.indexOf(keyword.toLowerCase()) !== -1);
    }
    // if (_list.length === 0) {
    //   _list = list.filter(city => city.phone.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);
    // }
    // if (_list.length === 0) {
    //   _list = list.filter(city => (city.name?.toLowerCase() + ' ' + city.family?.toLowerCase()).indexOf(keyword.toLowerCase()) !== -1);
    // }
    return _list;
  }

}
