import { Component, EventEmitter, Input, OnChanges, Output, forwardRef } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatDialog } from '@angular/material/dialog';
import { ResponsiveService } from 'src/app/Core/Services/responsive.service';


@Component({
  selector: 'prs-custom-select-hotel',
  templateUrl: './custom-select-hotel.component.html',
  styleUrls: ['./custom-select-hotel.component.scss']
})
export class CustomSelectHotelComponent {
  value: string = '';
  disabled = false;
  public dd = false;

  isMobile = false;
  isTablet=false;
  isDesktop=false;

  hotelFC = new FormControl();
  @Output() hotelSelected = new EventEmitter()
  @Input() hotels: any[] = []
  @Input() inCommingHotel: any;
  @Input() name= 'custom'
  @Input() title = 'هتل خود را انتخاب کنید';

  filteredOptions!: Observable<any[]>;

  constructor(
    public mobileService: ResponsiveService,
    public dialog: MatDialog,
  ){
    this.isMobile = mobileService.isMobile();
    this.isDesktop = mobileService.isDesktop();
    this.isTablet = mobileService.isTablet();
  }

  ngOnInit() {
    this.filteredOptions = this.hotelFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  ngOnChanges() {
    if (this.inCommingHotel && this.inCommingHotel !== '') {
      if (this.hotels.filter(c => (c.id === +this.inCommingHotel) ||
        (c.id === this.inCommingHotel) ||
        (c.title === this.inCommingHotel) ||
        (c.titleEn === this.inCommingHotel)).length > 0) {

        let hotel = this.hotels.filter(c =>
          (c.title === +this.inCommingHotel) ||
          (c.titleEn === this.inCommingHotel) ||
          (c.id === this.inCommingHotel))[0]
        this.hotelFC.setValue(hotel.title);
      }
    }
    this.filteredOptions = this.hotelFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: any): any[] {
    let filterValue = value
    if(filterValue !== '') {
      filterValue  = value;
    }
    return this.hotels.filter(hotel => (hotel.title.includes(filterValue) || hotel.titleEn?.includes(filterValue.toUpperCase())));
  }
  selectAll() {
    
  }

  getStars(count: string | number): number[] {
    if(count) {
      return Array.from(Array(+count).keys());

    }else {
     return []
    }
  }

  openDropdown() {
    // if(this.isMobile){
    //   this.openSelectCity();
    // }else {
      this.dd = true;
    // }
  }

  onClickedOutside(jmgg:any){
    this.dd = false
  }

  changed(item: any): void {
this.hotelFC.setValue(item.title);
    this.hotelSelected.emit(item)
    this.dd = false
  }

  // openSelectCity() {
  //   const dialog = this.dialog.open(SelectCityPopupComponent, {
  //     data: {
  //       cities: this.cities
  //     }
  //   })
  //   dialog.afterClosed().subscribe(Result => {
  //     if (Result) {
  //       this.hotelFC.setValue(Result.name)
  //       this.citySelected.emit(Result);
  //     }
  //   })
  // }

}
