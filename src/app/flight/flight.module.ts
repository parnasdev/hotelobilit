import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlightRoutingModule } from './flight-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { CommonProjectModule } from "../common-project/common-project.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from "../common-project/pipes/pipes.module";
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { IConfig, NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { CompositionComponent } from './composition/composition.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgxPaginationModule} from "ngx-pagination";
import { CompositionListComponent } from './composition-list/composition-list.component';
const maskConfigFunction: () => Partial<IConfig> = () => {
    return {
      validation: false,
    };
  };


@NgModule({
    declarations: [
        ListComponent,
        AddComponent,
        EditComponent,
        CompositionComponent,
        CompositionListComponent
    ],
    imports: [
        CommonModule,
        FlightRoutingModule,
        CommonProjectModule,
        FormsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        PipesModule,
        MatButtonToggleModule,
        NgxMaskDirective,
        NgxMaskPipe,
        MatTooltipModule,
        NgxPaginationModule,
    ], providers: [provideEnvironmentNgxMask(maskConfigFunction)],
})
export class FlightModule { }
