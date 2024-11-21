import { Injectable } from '@angular/core';
import { Observable, interval, Subject, map } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { environment } from "../../../../environments/environment";
import { Result } from "../../../Core/Models/result";
import {
  HttpClient,
  HttpEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpSentEvent, HttpUserEvent
} from "@angular/common/http";
import { PublicService } from "../../../Core/Services/public.service";

@Injectable({
  providedIn: 'root'
})
export class NoticeServiceService {
  destroy$ = new Subject<void>();

  constructor(public http: HttpClient, public publicService: PublicService) {}

  notice(): Observable<HttpEvent<Result<any>>> {
    const strUrl = environment.BACK_END_IP + '/panel/notice';
    return this.http.get<Result<any>>(strUrl, this.publicService.getDefaultHeaders());
  }

  getApiData(): Observable<any> {
    return interval(1000).pipe(
      takeUntil(this.destroy$),
      map(() => this.makeApiCall()),
      catchError(error => {
        console.error('API error:', error);
        return new Observable();
      })
    );
  }

  private makeApiCall(): Promise<HttpSentEvent | HttpHeaderResponse | HttpResponse<Result<any>> | HttpProgressEvent | HttpUserEvent<Result<any>> | undefined> {
    return this.notice().pipe(
      takeUntil(this.destroy$)
    ).toPromise();
  }

  playAudio(): void {
    const audio = new Audio('/assets/audio/notif.mp3');

    audio.play()
      .then(() => {
        console.log('Audio played successfully');
      })
      .catch((error) => {
        console.error('Error playing audio:', error);

        // Fallback: Show a play button
        const playButton = document.createElement('button');
        playButton.textContent = 'Play Audio';
        playButton.onclick = () => audio.play();
        document.body.appendChild(playButton);
      });
  }
}
