import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from "rxjs";
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';
@Component({
  selector: 'prs-dynamic-filter-horizontal',
  templateUrl: './dynamic-filter-horizontal.component.html',
  styleUrls: ['./dynamic-filter-horizontal.component.scss']
})
export class DynamicFilterHorizontalComponent {
  @Input() data:any
  @Output() result = new EventEmitter()
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
  }

  ngOnChanges() {
    debugger
    console.log(this.data);
    
  }

  openPicker(index: number) {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '80%',
      data: {
        dateList: [],
        type: 'single',
        selectCount: 60,
        todayMin: false
      }
    })
    dialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.data.filters[index].value = result.fromDate.dateEn
      }
    })
  }

  closeDialog() {
    this.result.emit(this.data)
    this.data.isFilter = true
  }


  protected readonly filter = filter;
}


