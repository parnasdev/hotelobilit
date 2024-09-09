import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { authInterceptorProviders } from './Core/interceptor/auth.interceptors';
import { MaterialModule } from './common-project/persianDatePickerAdapter/material.module';
import {CommonProjectModule} from "./common-project/common-project.module";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { ServiceWorkerModule } from '@angular/service-worker';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [
    AppComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          },
            defaultLanguage: 'en'
        }),
        CommonProjectModule,
        // ServiceWorkerModule.register('ngsw-worker.js', {
        //   enabled: !isDevMode(),
        //   // Register the ServiceWorker as soon as the application is stable
        //   // or after 30 seconds (whichever comes first).
        //   registrationStrategy: 'registerWhenStable:30000'
        // })

    ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
