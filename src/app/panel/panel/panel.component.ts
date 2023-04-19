import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {SettingService} from "../../Core/Services/setting.service";

declare let $: any;

@Component({
  selector: 'prs-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  constructor(public title: Title,
              public setting: SettingService) {
  }

  ngOnInit(): void {
    $('.btn-sidebar').click(() => {
      $('.sidebar').animate({
        width: ['toggle', 'swing'],
        opacity: ['toggle', 'swing'],
      })
      $('.main-page').toggleClass('main-full').animate(1500)
    })
    this.title.setTitle('پنل کاربری اسنپ تریپ')
  }

}
