import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter } from "rxjs";
import { PrsDatePickerComponent } from 'src/app/date-picker/prs-date-picker/prs-date-picker.component';
@Component({
  selector: 'prs-dynamic-filter-popup',
  templateUrl: './dynamic-filter-popup.component.html',
  styleUrls: ['./dynamic-filter-popup.component.scss']
})
export class DynamicFilterPopupComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DynamicFilterPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  ngOnInit() {
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
        this.data.data[index].value = result.fromDate.dateEn
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(this.data)
    this.data.isFilter = true
  }


  protected readonly filter = filter;
}
