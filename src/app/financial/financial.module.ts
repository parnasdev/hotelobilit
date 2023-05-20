import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialRoutingModule } from './financial-routing.module';
import { FinancialComponent } from './financial/financial.component';


@NgModule({
  declarations: [
    FinancialComponent
  ],
  imports: [
    CommonModule,
    FinancialRoutingModule
  ]
})
export class FinancialModule { }
