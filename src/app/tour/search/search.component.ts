import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';

@Component({
  selector: 'prs-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openPicker() {
    const dialog = this.dialog.open(PrsDatePickerComponent, {
      width: '60%'
    })
    dialog.afterClosed().subscribe(res => {

    })
  }
}
