import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonProjectModule } from '../common-project/common-project.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SetPricePopupComponent } from './set-price-popup/set-price-popup.component';
import { PipesModule } from "../common-project/pipes/pipes.module";


@NgModule({
    declarations: [
        ListComponent,
        AddComponent,
        EditComponent,
        SetPricePopupComponent
    ],
    imports: [
        CommonModule,
        RoomRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        CommonProjectModule,
        NgxPaginationModule,
        PipesModule
    ]
})
export class RoomModule { }
