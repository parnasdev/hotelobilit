import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './panel/panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PanelComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'hotel',
        // canActivate: [PanelItemGuardService],
        // data: {permitions: ['Hotel']},
        loadChildren: () => import('../hotel/panel/hotel-panel.module').then(m => m.HotelPanelModule)
      },
      // {
      //   path: 'tour',
      //   // canActivate: [PanelItemGuardService],
      //   // data: {permitions: ['Tour']},
      //   loadChildren: () => import('../tour/panel/tour-panel.module').then(m => m.TourPanelModule)
      // },
      {
        path: 'transfer',
        // canActivate: [PanelItemGuardService],
        // data: {permitions: ['Transfer']},
        loadChildren: () => import('../transfer/transfer.module').then(m => m.TransferModule)
      },
      {
        path: 'transferRate',
        // canActivate: [PanelItemGuardService],
        // data: {permitions: ['Transfer']},
        loadChildren: () => import('../transfer-rate/transfer-rate.module').then(m => m.TransferRateModule)
      },
      // {
      //   path: 'financial',
      //   loadChildren: () => import('../financial/financial.module').then(m => m.FinancialModule)
      // },
      // {
      //   path: 'agencies',
      //   // canActivate: [PanelItemGuardService],
      //   // data: {permitions: ['Agency']},
      //   loadChildren: () => import('../agencies/agencies.module').then(m => m.AgenciesModule)
      // },
      // {
      //   path: 'profile',
      //   component: EditComponent
      // },
      // {
      //   path: 'requestReserves',
      //   component: RequestReserveComponent
      // },
      // {
      //   path: 'cities',
      //   // canActivate: [PanelItemGuardService],
      //   // data: {permitions: ['Cities']},
      //   loadChildren: () => import('../cities/cities.module').then(m => m.CitiesModule)
      // },
      // {
      //   path: 'file-manager',
      //   loadChildren: () => import('../file-manager/file-manager.module').then(m => m.FileManagerModule)
      // },
      // {
      //   path: 'user-agency',
      //   loadChildren: () => import('../user/user-agencies/user-agencies.module').then(m => m.UserAgenciesModule)
      // },
      // {
      //   path: 'user',
      //   // data: {permitions: ['User','User.list']},
      //   // canActivate: [PanelItemGuardService],
      //   loadChildren: () => import('../user/user.module').then(m => m.UserModule)
      // }, {
      //   path: 'redirector',
      //   loadChildren: () => import('../redirector/redirector.module').then(m => m.RedirectorModule)
      // },
      // // {
      // //   path: 'blog',
      // //   // canActivate: [PanelItemGuardService],
      // //   // data: {permitions: ['Post']},

      // //   loadChildren: () => import('../blog/panel/blog-panel.module').then(m => m.BlogPanelModule)
      // // },
      // {
      //   path: 'setting',
      //   // canActivate: [PanelItemGuardService],
      //   // data: {permitions: ['Setting.change']},
      //   loadChildren: () => import('../setting/setting.module').then(m => m.SettingModule)
      // },
      // // {
      // //   path: 'gallery',
      // //   loadChildren: () => import('../gallery/gallery.module').then(m => m.GalleryModule)
      // // },
      // {
      //   path: 'roomType',
      //   // canActivate: [PanelItemGuardService],
      //   // data: {permitions: ['RoomType']},
      //   loadChildren: () => import('../room-type/room-type.module').then(m => m.RoomTypeModule)
      // },
      // {
      //   path: 'comment',
      //   loadChildren: () => import('../comment/comment.module').then(m => m.CommentModule)
      // },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
