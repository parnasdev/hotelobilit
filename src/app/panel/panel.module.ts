import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyRatesComponent } from './currency-rates/currency-rates.component';
import { ServiceRatesComponent } from './service-rates/service-rates.component';


@NgModule({
  declarations: [
    PanelComponent,
    SidebarComponent,
    HeaderComponent,
    DashboardComponent,
    CurrencyRatesComponent,
    ServiceRatesComponent
  ],
  imports: [
    CommonModule,
    PanelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PanelModule { }
