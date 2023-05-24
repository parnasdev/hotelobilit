import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadFileComponent} from "./upload-file/upload-file.component";
import {UploaderComponent} from "./uploader/uploader.component";
import {GetLatLongComponent} from "./get-lat-long/get-lat-long.component";
import {GetLocationComponent} from "./get-location/get-location.component";
import {TimePickerComponent} from './time-picker/time-picker.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UploadSingleComponent} from './upload-single/upload-single.component';
import {MultipleUploadComponent} from './multiple-upload/multiple-upload.component';
import {EditorComponent} from './editor/editor.component';
import {SelectCityComponent} from './select-city/select-city.component';
import {SelectHotelComponent} from './select-hotel/select-hotel.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AlertDialogComponent} from "./alert-dialog/alert-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {ChipsComponent} from './chips/chips.component';
import {Page404Component} from "./page404/page404.component";
import {PopupVideoComponent} from './popup-video/popup-video.component';
import {PipesModule} from "./pipes/pipes.module";
import {ShowLocationComponent} from './show-location/show-location.component';
// import {SelectCategoriesComponent} from './select-categories/select-categories.component';
import {MatSelectModule} from "@angular/material/select";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {FaqComponent} from './faq/faq.component';
import {FooterLinksComponent} from "./footer-links/footer-links.component";
import {EditorModule} from "@tinymce/tinymce-angular";
import { SelectCityTwoComponent } from './select-city-two/select-city-two.component';
import { SelectCityPopupComponent } from './select-city-popup/select-city-popup.component';
import { SelectCityLimitedComponent } from './select-city-limited/select-city-limited.component';
import { SelectSearchComponent } from './select-search/select-search.component';




@NgModule({
  declarations: [
    UploadFileComponent,
    AlertDialogComponent,
    UploaderComponent,
    GetLatLongComponent,
    GetLocationComponent,
    TimePickerComponent,
    UploadSingleComponent,
    MultipleUploadComponent,
    EditorComponent,
    SelectCityComponent,
    SelectHotelComponent,
    ChipsComponent,
    Page404Component,
    PopupVideoComponent,
    ShowLocationComponent,
    FaqComponent,
    FooterLinksComponent,
    SelectCityTwoComponent,
    SelectCityPopupComponent,
    SelectCityLimitedComponent,
    SelectSearchComponent,
  ],
  exports: [
    UploadFileComponent,
    GetLocationComponent,
    TimePickerComponent,
    SelectCityTwoComponent,
    UploadSingleComponent,
    MultipleUploadComponent,
    EditorComponent,
    SelectHotelComponent,
    SelectCityComponent,
    ChipsComponent,
    ShowLocationComponent,
    FaqComponent,
    FooterLinksComponent,
    SelectCityLimitedComponent,
    SelectSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDialogModule,
    EditorModule,
    PipesModule,
    MatSelectModule,
    NgxMatSelectSearchModule
  ], entryComponents: [UploadSingleComponent, AlertDialogComponent]
})
export class CommonProjectModule {
}
