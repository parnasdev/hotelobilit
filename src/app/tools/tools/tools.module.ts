import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BtnComponent} from "../btn/btn.component";



@NgModule({
  declarations: [
    BtnComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    BtnComponent
  ]
})
export class ToolsModule { }
