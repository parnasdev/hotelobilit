import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateComponent } from "./validate/validate.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ForgetComponent } from "./forget/forget.component";
import { AdminAuthComponent } from './admin-auth/admin-auth.component';

const routes: Routes = [

  {
    path: '',
    component: ValidateComponent
  },
  // {
  //   path: 'partner',
  //   component: AgencyValidateComponent
  // },
  {
    path: 'prs-admin',
    component: AdminAuthComponent
  },
  // {
  //   path: 'partner/login/:phoneNumber',
  //   component: AgencyLoginComponent
  // },
  {
    path: 'login/:phoneNumber',
    component: LoginComponent
  },
  {
    path: 'register/:phoneNumber',
    component: RegisterComponent
  },
  {
    path: 'forget/:phone',
    component: ForgetComponent
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
