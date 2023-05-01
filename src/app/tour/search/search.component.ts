import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';

@Component({
  selector: 'prs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  dateFC = new FormControl();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '60%',
      data: this.dateFC.value
    })
    dialog.afterClosed().subscribe(res => {
      console.log(res)
      this.dateFC.setValue(res.fromDate.dateFa)
    })
  }
}
