import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HotelPanelRoutingModule } from './hotel-panel-routing.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import {MatTabsModule} from '@angular/material/tabs';
import {
  IConfig,
  NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask
} from "ngx-mask";



import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonProjectModule } from "../../common-project/common-project.module";
import { MatDialogModule } from "@angular/material/dialog";
import { BarRatingModule } from "ngx-bar-rating";
import { ServicesComponent } from './services/services.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NgxPaginationModule } from "ngx-pagination";
import { PipesModule } from "../../common-project/pipes/pipes.module";
import { MatSelectModule } from '@angular/material/select';
import { ConfirmPricingModalComponent } from './confirm-pricing-modal/confirm-pricing-modal.component';
import { MainPickerComponent } from './main-picker/main-picker.component';
import { PricingComponent } from './pricing/pricing.component';
import { StoreModule } from 'src/app/store/store.module';
import { TransferServiceComponent } from './transfer-service/transfer-service.component';
import { UpdateTransferServicePopupComponent } from './update-transfer-service-popup/update-transfer-service-popup.component';
import { SetRoomsAndCoefficientComponent } from './set-rooms-and-coefficient/set-rooms-and-coefficient.component';
import { TabsComponent } from './tabs/tabs.component';
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
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
    TransferServiceComponent,
    UpdateTransferServicePopupComponent,
    SetRoomsAndCoefficientComponent,
    TabsComponent,
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
    StoreModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CommonProjectModule,
    BarRatingModule,
    NgxPaginationModule,
    MatSelectModule,
    MatTabsModule

  ], providers: [provideEnvironmentNgxMask(maskConfigFunction),
  ]
}
)

export class HotelPanelModule { }
