import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService } from "../../Core/Services/message.service";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { CityListRequestDTO, CityResponseDTO } from "../../Core/Models/cityDTO";
import { CityApiService } from "../../Core/Https/city-api.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'prs-select-city-popup',
  templateUrl: './select-city-popup.component.html',
  styleUrls: ['./select-city-popup.component.scss']
})
export class SelectCityPopupComponent implements OnInit {
  isLoading = false;
  keyword = ''
  constructor(public cityApi: CityApiService,
    public dialogRef: MatDialogRef<SelectCityPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {cities :CityResponseDTO[]},
    public dialog: MatDialog,
    public message: MessageService) { }

  ngOnInit(): void {
    console.log(this.data)
  }


  onCitySelected(cityItem: CityResponseDTO) {
    this.dialogRef.close(cityItem)
  }
}
