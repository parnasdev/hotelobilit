import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // {
  //   path: 'transfer',
  //   // canActivate: [PanelItemGuardService],
  //   // data: {permitions: ['Transfer']},
  //   loadChildren: () => import('../transfer/transfer.module').then(m => m.TransferModule)
  // },
  // {
  //   path: 'transferRate',
  //   // canActivate: [PanelItemGuardService],
  //   // data: {permitions: ['Transfer']},
  //   loadChildren: () => import('../transfer-rate/transfer-rate.module').then(m => m.TransferRateModule)
  // },
  // {
  //   path: 'cities',
  //   // canActivate: [PanelItemGuardService],
  //   // data: {permitions: ['Cities']},
  //   loadChildren: () => import('../cities/cities.module').then(m => m.CitiesModule)
  // },
  // {
  //   path: 'hotel',
  //   // canActivate: [PanelItemGuardService],
  //   // data: {permitions: ['Hotel']},
  //   loadChildren: () => import('../hotel/panel/hotel-panel.module').then(m => m.HotelPanelModule)
  // },
  // {
  //   path: 'file-manager',
  //   loadChildren: () => import('../file-manager/file-manager.module').then(m => m.FileManagerModule)
  // },
  // {
  //   path: 'user',
  //   // data: {permitions: ['User','User.list']},
  //   // canActivate: [PanelItemGuardService],
  //   loadChildren: () => import('../user/user.module').then(m => m.UserModule)
  // }, 
  // {
  //   path: 'setting',
  //   // canActivate: [PanelItemGuardService],
  //   // data: {permitions: ['Setting.change']},
  //   loadChildren: () => import('../setting/setting.module').then(m => m.SettingModule)
  // },
  // {
  //   path: 'roomType',
  //   // canActivate: [PanelItemGuardService],
  //   // data: {permitions: ['RoomType']},
  //   loadChildren: () => import('../room-type/room-type.module').then(m => m.RoomTypeModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
