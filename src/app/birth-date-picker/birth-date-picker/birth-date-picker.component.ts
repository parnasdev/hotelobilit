import { Component, Inject, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { BaseBirthDateComponent } from '../base-birth-date/base-birth-date.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'prs-birth-date-picker',
  templateUrl: './birth-date-picker.component.html',
  styleUrls: ['./birth-date-picker.component.scss']
})
export class BirthDatePickerComponent implements OnInit {
  dateFC = new FormControl()
  @Input() lang = 'fa';
  @Input() name = 'تاریخ تولد'
  @Output() sendDate = new EventEmitter();
  constructor(public route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BaseBirthDateComponent,
      { data: this.lang}
    ).afterDismissed().subscribe((result) => {
      if (result) {
        this.sendDate.emit(result)
        this.dateFC.setValue(result)
      }
    });
  }

}
