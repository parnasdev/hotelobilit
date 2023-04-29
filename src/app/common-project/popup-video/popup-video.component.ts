import {Component, Inject, Input, OnInit} from '@angular/core';
import {MediaLinkDTO} from "../../Core/Models/hotelDTO";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'prs-popup-video',
  templateUrl: './popup-video.component.html',
  styleUrls: ['./popup-video.component.scss']
})
export class PopupVideoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PopupVideoComponent>,
              public router: Router,
              @Inject(MAT_DIALOG_DATA) public data: {list:MediaLinkDTO[], name:string} ) {
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  goToYoutube(): void {
    window.open(this.data.list[1].link);
  }
}
