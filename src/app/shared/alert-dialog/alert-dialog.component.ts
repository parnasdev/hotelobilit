import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {AlertDialogDTO} from "./models/models";
// import { AlertDialogDTO } from '../../models.ts/shared.model';

@Component({
  selector: 'prs-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  standalone: true,
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlertDialogDTO,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

  yes() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

}
