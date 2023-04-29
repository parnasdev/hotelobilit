import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'prs-btn',
  templateUrl: './btn.component.html',
  styleUrls: ['./btn.component.scss']
})
export class BtnComponent implements OnInit, OnChanges {
  @Input() label = 'ثبت'
  @Input() background = 'blue' // dark or blue
  @Input() isLoading = false;
  @Input() type = 'button';
  loading = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = this.isLoading
  }

}
