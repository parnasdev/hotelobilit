import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {SettingService} from "../../Core/Services/setting.service";
import {SessionService} from 'src/app/Core/Services/session.service';
import {ResponsiveService} from "../../Core/Services/responsive.service";

declare let $: any;

@Component({
  selector: 'prs-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  isDarkMode = false;
  isLoading = false;
  isTablet = false;
  isDesktop = false;
  isSidebarMobi = false;

  constructor(public title: Title,
              public session: SessionService,
              public responsiveService: ResponsiveService,
              public setting: SettingService) {
    this.isTablet = responsiveService.isTablet();
    this.isDesktop = responsiveService.isDesktop();
  }

  ngOnInit(): void {
    $('.toggle-sidebar').click(() => {
      $('.p-sidebar').animate({
        width: ['toggle', 'swing'],
        opacity: ['toggle', 'swing'],
      })
      $('.main').toggleClass('main-full').animate(1500)
      $('.toggle-sidebar-open').css('display', 'flex')
      $('.toggle-sidebar-open').addClass('animated fadeInRight')

    })
    $('.toggle-sidebar-open').click(() => {
      $('.p-sidebar').animate({
        width: ['toggle', 'swing'],
        opacity: ['toggle', 'swing'],
      })
      $('.main').removeClass('main-full').animate(1500)
      $('.toggle-sidebar-open').css('display', 'none')
    })
    $('.dark-mode').click(() => {
      $('.s-panel').toggleClass('dark-mode-panel');
    })

    this.title.setTitle('پنل کاربری هتل و بلیط')
  }

  darkMode(): any {
    this.isDarkMode = !this.isDarkMode
  }

  sidebarMobi() {
    this.isSidebarMobi = !this.isSidebarMobi
  }
}
