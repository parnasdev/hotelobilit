import {Component, Input, OnInit, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {ServiceDTO, ServicesDTO} from "../../../Core/Models/hotelDTO";

@Component({
  selector: 'prs-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnChanges {
  @Input() services: ServiceDTO[] = []
  @Output() result = new EventEmitter();
  @Input() inComing!: ServicesDTO

  constructor() {
  }

  ngOnInit(): void {
  }

  changeChecked(): void {
    let result: ServiceDTO[] = []
    this.services.forEach(x => {
      if (x.checked) {
        result.push(x);
      }
    })
    this.result.emit(result);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.services.length > 0) {
      this.services.forEach(x => {
        this.inComing.ids.forEach(y => {
          if (x.id == +y) {
            x.checked = true;
          }
        })
      })
    }
    this.changeChecked()

  }
}
