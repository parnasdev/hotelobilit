import { Component, EventEmitter, Input, OnChanges, Output, forwardRef } from '@angular/core';
import { FormControl } from "@angular/forms";
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatDialog } from '@angular/material/dialog';
import { SelectCityPopupComponent } from '../select-city-popup/select-city-popup.component';
import { ResponsiveService } from 'src/app/Core/Services/responsive.service';

declare let $: any;

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

  cityFC = new FormControl();

  @Output() citySelected = new EventEmitter()
  @Input() cities: categoriesDTO[] = []
  @Input() inCommingCity: any;
  @Input() name= 'custom'
  @Input() baseType: boolean = false;
  @Input() title = 'شهر خود را وارد کنید';

  filteredOptions!: Observable<categoriesDTO[]>;

  constructor(
    public mobileService: ResponsiveService,
    public dialog: MatDialog,
  ){
    this.isMobile = mobileService.isMobile();
    this.isDesktop = mobileService.isDesktop();
    this.isTablet = mobileService.isTablet();
  }

  ngOnInit() {
    this.filteredOptions = this.cityFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  ngOnChanges() {
    // if (this.inCommingCity && this.inCommingCity !== '') {
    //   if (this.cities.filter(c => (c.id === +this.inCommingCity) ||
    //     (c.id === this.inCommingCity) ||
    //     (c.code === this.inCommingCity) ||
    //     (c.standardCode === this.inCommingCity) ||
    //     (c.slug === this.inCommingCity)).length > 0) {
    //
    //     let city = this.cities.filter(c =>
    //       (c.id === +this.inCommingCity) ||
    //       (c.code === this.inCommingCity) ||
    //       (c.standardCode === this.inCommingCity) ||
    //       (c.slug === this.inCommingCity))[0]
    //     this.cityFC.setValue(city.name);
    //     // this.title = city.name
    //     // this.citySelected.emit(this.cities.filter(c => c.slugEn === this.inCommingCity)[0])
    //   }
    // }
    // this.filteredOptions = this.cityFC.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value)),
    // );
  }

  private _filter(value: any): categoriesDTO[] {
    let filterValue = value
    if(filterValue !== '') {
      filterValue  = value;
    }
    return this.cities.filter(city => city.name.includes(filterValue) || city.code?.includes(filterValue));
  }

  openDropdown() {
    if(this.isMobile){
      this.openSelectCity();
    }else {
      this.dd = true;
    }
  }

  onClickedOutside(jmgg:any){
    this.dd = false
  }

  changed(item: any): void {
    this.citySelected.emit(item)
    this.dd = false
  }

  openSelectCity() {
    const dialog = this.dialog.open(SelectCityPopupComponent, {
      data: {
        cities: this.cities
      }
    })
    dialog.afterClosed().subscribe(Result => {
      if (Result) {
        this.cityFC.setValue(Result.name)
        this.citySelected.emit(Result);
      }
    })
  }

}
