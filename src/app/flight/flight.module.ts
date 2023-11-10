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


@NgModule({
    declarations: [
        ListComponent,
        AddComponent,
        EditComponent
    ],
    imports: [
        CommonModule,
        FlightRoutingModule,
        CommonProjectModule,
        FormsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        PipesModule,
        MatButtonToggleModule
    ]
})
export class FlightModule { }
