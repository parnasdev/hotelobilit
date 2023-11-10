import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {filter} from "rxjs";
@Component({
  selector: 'prs-dynamic-filter-popup',
  templateUrl: './dynamic-filter-popup.component.html',
  styleUrls: ['./dynamic-filter-popup.component.scss']
})
export class DynamicFilterPopupComponent implements OnInit{
  constructor(public dialogRef: MatDialogRef<DynamicFilterPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {

  }

  ngOnInit() {

  }

  setValue(event:any,index:any){
    this.data[index].value= this.data[index].type==='select' ? event[this.data[index].reqKey] :event
  }

  closeDialog(){
    this.dialogRef.close()
    this.data.isFilter=true
  }


  protected readonly filter = filter;
}
