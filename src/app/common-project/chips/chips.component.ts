import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'prs-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit, OnChanges {
  textFC = new FormControl('', Validators.required);
  list: string[] = [];
  @Output() result = new EventEmitter()
  @Input() inComing: string[] = []
  @Input() placeHolder = 'کلمه خود را وارد کنید سپس دکمه Enter را بزنید'

  constructor() {
  }

  ngOnInit(): void {
  }

  remove(index: number): void {
    this.list.splice(index, 1);
    this.result.emit(this.list)
  }

  add(): void {
    debugger
    if (this.textFC.valid) {
      this.list.push(this.textFC.value);
      this.textFC.reset()
    }
    this.result.emit(this.list)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inComing && this.inComing.length > 0) {
      this.list = this.inComing;

    }
  }

}
