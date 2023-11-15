import {Component, Input} from '@angular/core';

@Component({
  selector: 'prs-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent {
  @Input() color = '#000';

  @Input() name = '';
  @Input() width = '40px';
  @Input() height = '40px';

}
