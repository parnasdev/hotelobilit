import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelPanelRoutingModule } from './hotel-panel-routing.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonProjectModule} from "../../common-project/common-project.module";
import {MatDialogModule} from "@angular/material/dialog";
import {BarRatingModule} from "ngx-bar-rating";
import {ServicesComponent} from './services/services.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {NgxPaginationModule} from "ngx-pagination";
import {PipesModule} from "../../common-project/pipes/pipes.module";
import {MatSelectModule} from '@angular/material/select';
import { IConfig } from 'ngx-mask';
import { PricingPopupComponent } from './pricing-popup/pricing-popup.component';
import { ConfirmPricingModalComponent } from './confirm-pricing-modal/confirm-pricing-modal.component';
import { MainPickerComponent } from './main-picker/main-picker.component';
import { PricingComponent } from './pricing/pricing.component';
const maskConfig: Partial<IConfig> = {
  validation: false,
};


@NgModule({
  declarations: [
    AddComponent,
    EditComponent,
    ListComponent,
    ServicesComponent,
    MainPickerComponent,
    PricingComponent,
    ConfirmPricingModalComponent,
    PricingPopupComponent
  ],
  imports: [
    CommonModule,
    HotelPanelRoutingModule,
    MatDialogModule,
    MatButtonToggleModule,
    FormsModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    PipesModule,
    CommonProjectModule,
    BarRatingModule,
    NgxPaginationModule,
    MatSelectModule,
  ]
})
export class HotelPanelModule { }
