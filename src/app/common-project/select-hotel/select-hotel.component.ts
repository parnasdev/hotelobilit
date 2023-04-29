import {Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {HotelListResponseDTO, HotelRequestDTO} from "../../Core/Models/hotelDTO";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {HotelApiService} from "../../Core/Https/hotel-api.service";
import {MessageService} from "../../Core/Services/message.service";

@Component({
  selector: 'prs-select-hotel',
  templateUrl: './select-hotel.component.html',
  styleUrls: ['./select-hotel.component.scss']
})
export class SelectHotelComponent implements OnInit,OnChanges {
  @Output() hotelSelected = new EventEmitter()
  @Input() hotels: any[] =  [];
  @Input() callHotel: boolean =  false;
  @Input() inCommingHotel : any
  @Input() isAdmin = false
  @Input() type = true
  isLoading = false;
  constructor(
    public hotelApi: HotelApiService,
    public message: MessageService) {
  }
  hotelFC = new FormControl();
  filteredOptions!: Observable<HotelListResponseDTO[]>;

  ngOnInit() {

  }

  private _filter(value: string): HotelListResponseDTO[] {
    return this.hotels.filter(city => city.keyword.toLowerCase().indexOf(value.toLowerCase()) !== -1);

    // const filterValue = value.toLowerCase();
    //
    // return this.hotels.filter(hotel => hotel.keyword.toLowerCase().includes(filterValue));
  }

  changed(item: any):void {
    this.hotelSelected.emit(item)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredOptions = this.hotelFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    if (this.inCommingHotel) {
      this.hotelFC.setValue(this.type ? this.inCommingHotel.name : this.inCommingHotel.nameEn)
      this.hotelSelected.emit(this.inCommingHotel)

    }

    if (this.callHotel) {
      this.getHotels()
    }
  }

  getHotels(): void {
    this.isLoading = true
    const req: HotelRequestDTO = {
      isAdmin: this.isAdmin,
      paginate: false,
      city: null,
      search: null,
    }
    this.hotelApi.getHotels(req).subscribe((res: any) => {
      this.isLoading = false

      if (res.isDone) {
        this.hotels = res.data;
        this.filteredOptions = this.hotelFC.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value)),
        );
      }
    }, (error: any) => {
      this.isLoading = false

      this.message.error();
    })
  }
}
