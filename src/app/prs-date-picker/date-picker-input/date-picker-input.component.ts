import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { ResponsiveService } from "../../Core/Services/responsive.service";
import { NewDatePickerMobileComponent } from '../new-date-picker-mobile/new-date-picker-mobile.component';
import * as moment from 'jalali-moment';
import {NewDatePickerPopupComponent} from "../new-date-picker-popup/new-date-picker-popup.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'prs-date-picker-input',
  templateUrl: './date-picker-input.component.html',
  styleUrls: ['./date-picker-input.component.scss']
})
export class DatePickerInputComponent implements OnInit, OnChanges {
  dateFC = new FormControl()
  @Input() title = '';
  @Input() lang = 'fa';
  @Input() errorItem: any;
  @Input() minDate = ''
  @Input() maxDate = ''
  @Input() incommingDate = '';
  @Output() sendDate = new EventEmitter();
  show = true;
  isMobile = false;
  isTablet = false;
  isDesktop = false;
  year = 0;
  month = 0;
  day = 0



  constructor(public route: ActivatedRoute,
    public calendarService: CalenderServices,
    public errorsService: ErrorsService,
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    public responsiveService: ResponsiveService) {
    this.isMobile = responsiveService.isMobile();
    this.isTablet = responsiveService.isTablet();
    this.isDesktop = responsiveService.isDesktop();
  }

  ngOnInit(): void {

  }

  reload() {
    this.show = false;
    setTimeout(() => this.show = true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incommingDate'] && changes['incommingDate'].currentValue !== '') {
      let check = this.checkMiladi(changes['incommingDate'].currentValue);
      let date = '';
      if (this.lang === 'fa') {
        if (check) {
          date = moment(changes['incommingDate'].currentValue, 'YYYY-MM-DD').format('jYYYY-jM-jD');
        } else {
          date = changes['incommingDate'].currentValue
        }
      } else {
        date = changes['incommingDate'].currentValue
      }

      this.day = +date.split('-')[2]
      this.month = +date.split('-')[1]
      this.year = +date.split('-')[0]
      this.dateFC.setValue(date.split('-')[0] + '-' + date.split('-')[1] + '-' + date.split('-')[2]);
    }
  }


  checkMiladi(date: string) {
    if (date && date !== '') {
      let year = +date.split('-')[0];
      if (year > 1800) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  openDialog(step: number): void {


    this.dialog.open(NewDatePickerPopupComponent,
      {
        width:'50%',
        height: '50%',
        data: {
          lang: this.lang,
          title: this.title,
          step: step,
          minDate: this.minDate,
          maxDate: this.maxDate
        }
      }
    ).afterClosed().subscribe((result) => {
      if (result) {
        if (result.step === 1) {
          this.year = result.title;
        } else if (result.step === 2) {
          this.month = result.title;
        } else {
          this.day = result.title
        }
        if (this.day !== 0 && this.month !== 0 && this.year !== 0) {
          this.dateFC.setValue(this.year + '-' + this.month + '-' + this.day)
          this.sendDate.emit(this.dateFC.value)
        }
        let str:any = 'passengers.' + this.errorItem.index + '.passengers.' + this.errorItem.i + '.' + this.errorItem.name;
        this.errorsService.clear(str)
      }
    });
  }

  openBottomSheet(step: number): void {
    this._bottomSheet.open(NewDatePickerMobileComponent,
      {
        data: {
          lang: this.lang,
          title: this.title,
          step: step,
          minDate: this.minDate,
          maxDate: this.maxDate
        }
      }
    ).afterDismissed().subscribe((result) => {
      if (result) {
        if (result.step === 1) {
          this.year = result.title;
        } else if (result.step === 2) {
          this.month = result.title;
        } else {
          this.day = result.title
        }
        if (this.day !== 0 && this.month !== 0 && this.year !== 0) {
          this.dateFC.setValue(this.year + '-' + this.month + '-' + this.day)
          this.sendDate.emit(this.dateFC.value)
        }
        let str:any = 'passengers.' + this.errorItem.index + '.passengers.' + this.errorItem.i + '.' + this.errorItem.name;
        this.errorsService.clear(str)
      }
    });
  }


  hasError() {
    return this.errorsService.hasError('passengers.' + this.errorItem.index + '.passengers.' + this.errorItem.i + '.' + this.errorItem.name)
  }

  getError() {
    return this.errorsService.getError('passengers.' + this.errorItem.index + '.passengers.' + this.errorItem.i + '.' + this.errorItem.name)
  }

}
