import {Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {HotelListResponseDTO, HotelRequestDTO} from "../../Core/Models/hotelDTO";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {HotelApiService} from "../../Core/Https/hotel-api.service";
import {MessageService} from "../../Core/Services/message.service";

@Component({
  selector: 'prs-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss']
})
export class SelectSearchComponent {
  @Output() hotelSelected = new EventEmitter()
  @Input() airports: any[] =  [];
  @Input() inCommingAirport : any
  @Input() isAdmin = false
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
    return this.airports?.filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  changed(item: any):void {
    this.hotelSelected.emit(item)
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes['airports']) {
      this.filteredOptions = this.hotelFC.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );
    }

    if (this.inCommingAirport) {
      this.hotelFC.setValue(this.inCommingAirport.name)
      this.hotelSelected.emit(this.inCommingAirport)

    }
  }

}
