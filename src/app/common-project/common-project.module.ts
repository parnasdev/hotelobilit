import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from "./upload-file/upload-file.component";
import { UploaderComponent } from "./uploader/uploader.component";
import { GetLatLongComponent } from "./get-lat-long/get-lat-long.component";
import { GetLocationComponent } from "./get-location/get-location.component";
import { TimePickerComponent } from './time-picker/time-picker.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UploadSingleComponent } from './upload-single/upload-single.component';
import { MultipleUploadComponent } from './multiple-upload/multiple-upload.component';
import { EditorComponent } from './editor/editor.component';
import { SelectCityComponent } from './select-city/select-city.component';
import { SelectHotelComponent } from './select-hotel/select-hotel.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AlertDialogComponent } from "./alert-dialog/alert-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ChipsComponent } from './chips/chips.component';
import { Page404Component } from "./page404/page404.component";
import { PopupVideoComponent } from './popup-video/popup-video.component';
import { PipesModule } from "./pipes/pipes.module";
import { ShowLocationComponent } from './show-location/show-location.component';
// import {SelectCategoriesComponent} from './select-categories/select-categories.component';
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FaqComponent } from './faq/faq.component';
import { FooterLinksComponent } from "./footer-links/footer-links.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import { SelectCityTwoComponent } from './select-city-two/select-city-two.component';
import { SelectCityPopupComponent } from './select-city-popup/select-city-popup.component';
import { SelectCityLimitedComponent } from './select-city-limited/select-city-limited.component';
import { SelectSearchComponent } from './select-search/select-search.component';
import { LoadingComponent } from './loading/loading.component';
import { CustomSelectHotelComponent } from './custom-select-hotel/custom-select-hotel.component';
import { ClickOutsideDirective } from "./click-outside.directive";
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { DynamicListComponent } from './dynamic-list/dynamic-list.component';
import { DynamicFilterPopupComponent } from './dynamic-filter-popup/dynamic-filter-popup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DynamicFilterHorizontalComponent } from './dynamic-filter-horizontal/dynamic-filter-horizontal.component';




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
    LoadingComponent,
    CustomSelectHotelComponent,
    ClickOutsideDirective,
    CustomSelectComponent,
    DynamicListComponent,
    DynamicFilterPopupComponent,
    DynamicFilterHorizontalComponent
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
    SelectSearchComponent,
    LoadingComponent,
    CustomSelectHotelComponent,
    CustomSelectComponent,
    DynamicListComponent,
    DynamicFilterPopupComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    EditorModule,
    PipesModule,
    MatTooltipModule,
    MatSelectModule,
    NgxMatSelectSearchModule
  ], entryComponents: [UploadSingleComponent, AlertDialogComponent]
})
export class CommonProjectModule {
}
