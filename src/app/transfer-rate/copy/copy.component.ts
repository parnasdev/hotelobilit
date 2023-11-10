import { Component } from '@angular/core';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'prs-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss']
})
export class CopyComponent extends EditComponent {


  override ngOnInit() {
    this.title.setTitle('کپی پرواز | هتل و بلیط')
    this.id = this.route.snapshot.paramMap.get('id') ?? ''
    this.getInfoData();
  }
}
