import { Component, Input } from '@angular/core';
import { CalenderServices } from 'src/app/Core/Services/calender-service';

@Component({
  selector: 'prs-reserve-timer',
  templateUrl: './reserve-timer.component.html',
  styleUrls: ['./reserve-timer.component.scss']
})
export class ReserveTimerComponent {
  @Input() expired_date = ''
  @Input() width = '20px'
  @Input() height = '20px'
  hours = 0
  minutes = 0
  seconds = 0
  constructor(public calService: CalenderServices) {

  }

  ngOnChanges(changes: any) {
    if (changes.expired_date) {
      this.getDiff()
      this.startTimer()
    }
  }
  getDiff() {
    let diff = this.calService.getDiff(this.expired_date).milliseconds;
    this.seconds = Math.floor((diff / 1000) % 60),
      this.minutes = Math.floor((diff / (1000 * 60)) % 60),
      this.hours = Math.floor((diff / (1000 * 60 * 60)));
  }

  startTimer() {
    return setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.seconds = 59;
        this.minutes--;
      } else if (this.hours > 0) {
        this.seconds = 59;
        this.minutes = 59;
        this.hours--;
      } else {
        // timer ended
      }
    }, 1000);
  }

  formatter(n: number): string {
    if(n > 0) {
      return n > 9 ? ('' + n) : ('0' + n);
    }else {
      return '00'

    }
    
  }
}
