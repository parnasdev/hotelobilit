import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { PanelComponent } from './panel/panel.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [PanelComponent, SidebarComponent, HeaderComponent],
  imports: [
    CommonModule,
    PanelRoutingModule
  ]
})
export class PanelModule { }
