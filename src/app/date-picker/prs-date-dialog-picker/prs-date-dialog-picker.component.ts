import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'prs-prs-date-picker',
  templateUrl: './prs-date-dialog-picker.component.html',
  styleUrls: ['./prs-date-dialog-picker.component.scss']
})
export class PrsDateDialogPickerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PrsDateDialogPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) {
  }

  getDates(dates:any) {
    this.dialogRef.close(dates)
  }

  ngOnInit() {

  }
}
