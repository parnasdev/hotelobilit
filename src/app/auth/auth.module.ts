import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { ValidateComponent } from './validate/validate.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetComponent } from "./forget/forget.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ResendCodeComponent } from './resend-code/resend-code.component';
import { RouterModule } from "@angular/router";
import { AdminAuthComponent } from './admin-auth/admin-auth.component';
import { ConfirmPhoneComponent } from './confirm-phone/confirm-phone.component';
import { CodeInputModule } from 'angular-code-input';


@NgModule({
  declarations: [
    ValidateComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    ResendCodeComponent,
    AdminAuthComponent,
    ConfirmPhoneComponent,
  ],
  exports: [
    RegisterComponent,
    LoginComponent,
    ResendCodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AuthRoutingModule,
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: true,
      code: 'abcdef'
    }),

    // StoreModule
  ]
})
export class AuthModule {
}
