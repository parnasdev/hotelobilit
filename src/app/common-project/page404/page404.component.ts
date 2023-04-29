import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RedirectorApiService} from "../../Core/Https/redirector-api.service";
import {MessageService} from "../../Core/Services/message.service";

@Component({
  selector: 'prs-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component implements OnInit {

  constructor(public api: RedirectorApiService,
              public router: Router,
              public message: MessageService) {
  }

  ngOnInit(): void {
    this.redirect()
  }

  redirect(): void {
    this.api.findOldUrl(window.location.pathname).subscribe((res: any) => {
      if (res.isDone) {
        if (res.data) {
          this.router.navigateByUrl(res.data);
        }
      }
    })
  }

}
