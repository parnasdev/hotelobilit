import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './Core/guards/auth-guard.service';
import { PanelGuardService } from './Core/guards/panel-guard.service';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      }, 
      {
        path: 'panel',
        canActivate: [PanelGuardService],
        loadChildren: () => import('./panel/panel.module').then(m => m.PanelModule)
      }, 
      // {
      //   path: 'dashboard',
      //   canActivate: [DashboardGuardService],
      //   loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      // },
      // {
      //   path: 'not-found',
      //   component: Page404Component
      // },
      // {
      //   path: '',
      //   canActivate: [HomeGuardService],
      //   loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
      // },
      // {
      //   path: '',
      //   loadChildren: () => import('./store/store.module').then(m => m.StoreModule)
      // },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
