import {Component, OnDestroy, OnInit} from '@angular/core';
import { AuthApiService } from './Core/Https/auth-api.service';
import { UserApiService } from './Core/Https/user-api.service';
import { SessionService } from './Core/Services/session.service';
import { MessageService } from './Core/Services/message.service';
import { CheckErrorService } from './Core/Services/check-error.service';
import { PermitionsService } from './Core/Services/permitions.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {PusherService} from "./shared/services/pusher.service";
import {NoticeService} from "./Core/Https/notice.service";
import {PublicService} from "./Core/Services/public.service";
import {Subscription} from "rxjs";



declare var Pusher:any
@Component({
  selector: 'prs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit , OnDestroy {
  private audio = new Audio('assets/audio/notif.mp3');
  private intervalId: any;
  private noticeSubscription: Subscription | null = null;
  private isFetching = false;



  constructor(public session: SessionService,
    public userApi: UserApiService,
    public pemitionService: PermitionsService,
    public api: AuthApiService,
    public router: Router,
    public translate: TranslateService,
    public noticeService: NoticeService,
    public messageService: MessageService,
              public message: MessageService,

    public checkError: CheckErrorService) {
    translate.addLangs(['fa', 'tr', 'en']);

    let currentLang = localStorage.getItem('hotelobilit-lang')
    this.translate.use(currentLang ?? 'fa')
    this.audio.load(); // Preload the audio
    this.unlockAudio(); // Unlock autoplay
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    // translate.use('fa');
    // const browserLang = translate.getBrowserLang();
    // translate.use(browserLang?.match(/en|tr|fa/) ? browserLang : 'fa');

    //
    // let channel=socket.subscribe('reserve-notice').bind('reserve.notice',()=>{
    //   alert('hi')
    // })
  }

  private unlockAudio() {
    const silentAudio = new Audio();
    silentAudio.muted = true;
    silentAudio.play()
      .then(() => {
        console.log('Audio autoplay successfully unlocked.');
      })
      .catch((error) => {
        console.warn('Failed to unlock audio autoplay:', error);
      });
  }

  private playNotificationSound() {
    this.audio.play()
      .then(() => {
        console.log('Notification sound played.');
      })
      .catch((error) => {
        console.warn('Error playing notification sound:', error);
      });
  }

  private getNotice() {
    if (this.isFetching) {
      console.warn('Already fetching notices, skipping duplicate call.');
      return;
    }

    this.isFetching = true;
    this.noticeSubscription = this.noticeService.getNotice().subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.isDone && res.data) {
          this.message.custom('رزرو جدید! گزارشات را چک کنید.');
          this.playNotificationSound();
        }
      },
      (error: any) => {
        this.isFetching = false;
        console.warn('Error fetching notices:', error);
      }
    );
  }

  startSoundInterval(): void {
    if (this.intervalId) {
      console.warn('Interval already running.');
      return;
    }

    this.intervalId = setInterval(() => {
      this.getNotice();
    }, 30000); // 30 seconds
  }

  ngOnDestroy(): void {
    if (this.noticeSubscription) {
      this.noticeSubscription.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }




  title = 'hotelobilit';


  ngOnInit(): void {
    this.getUserData()
    this.startSoundInterval();


  }




  onActivate(event: any) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

  getUserData(): void {
    if (this.session.isLoggedIn()) {
      this.api.me().subscribe((res: any) => {
        if (res.isDone) {
          this.session.setUserToSession(res.data);
          this.pemitionService.permissions = res.data.permissions;
          // this.session.getUserPermission();
        } else {
          this.messageService.custom(res.message);
        }
      }, (error: any) => {
        if (error.status === 401) {
          this.session.removeUser();
          this.router.navigateByUrl('/auth');
        }
      });
    }
  }
}
