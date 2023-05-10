import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService } from "../../Core/Services/message.service";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { CityListRequestDTO, CityResponseDTO } from "../../Core/Models/cityDTO";
import { CityApiService } from "../../Core/Https/city-api.service";
import { MatDialog } from '@angular/material/dialog';
import { SelectCityPopupComponent } from '../select-city-popup/select-city-popup.component';
import { Result } from 'src/app/Core/Models/result';
import { ResponsiveService } from 'src/app/Core/Services/responsive.service';
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import { CityListReq, CityListRes } from 'src/app/Core/Models/newCityDTO';

@Component({
  selector: 'prs-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss']
})
export class SelectCityComponent implements OnInit, OnChanges {
  @Output() citySelected = new EventEmitter()
  @Input() cities: categoriesDTO[] = []
  @Input() hasHotel: boolean = false;
  @Input() hasFlight: boolean = false;
  @Input() type: number | null = null;
  @Input() city: number | null = null;
  @Input() inCommingCity: any;
  @Input() baseType: boolean = false;
  @Input() title = 'شهر خود را وارد کنید';
  isLoading = false
  isMobile = false;

  constructor(
    public cityApi: CityApiService,
    public dialog: MatDialog,
    public mobileService: ResponsiveService,
    public message: MessageService) {
    this.isMobile = mobileService.isMobile();
  }

  cityFC = new FormControl();
  filteredOptions!: Observable<categoriesDTO[]>;

  ngOnInit() {
  }

  private _filter(value: string): categoriesDTO[] {
    const filterValue = value.toLowerCase();

    return this.cities.filter(city => city.name.toLowerCase().includes(filterValue));
  }

  changed(item: any): void {
    this.citySelected.emit(item)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredOptions = this.cityFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    if (this.inCommingCity && this.inCommingCity !== '') {
      if (this.cities.filter(c => (c.id === +this.inCommingCity) ||
        (c.id === this.inCommingCity) ||
        (c.code === this.inCommingCity) ||
        (c.slug === this.inCommingCity)).length > 0) {
        this.cityFC.setValue(this.cities.filter(c => 
          (c.id === +this.inCommingCity) ||
          (c.code === this.inCommingCity) ||
          (c.slug === this.inCommingCity))[0].name)
        // this.citySelected.emit(this.cities.filter(c => c.slugEn === this.inCommingCity)[0])
      }
    }
    this.filteredOptions = this.cityFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
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
        this.citySelected.emit(Result)
      }
    })
  }



}
