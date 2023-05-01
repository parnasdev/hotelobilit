import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'prs-prs-date-picker',
  templateUrl: './prs-date-picker.component.html',
  styleUrls: ['./prs-date-picker.component.scss']
})
export class PrsDatePickerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PrsDatePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {
  }


  ngOnInit() {
  }
}
