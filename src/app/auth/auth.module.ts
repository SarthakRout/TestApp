import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { AuthGuestComponent } from './auth-guest/auth-guest.component';
import { AuthRegisterComponent } from './auth-register/auth-register.component';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthLogoutComponent } from './auth-logout/auth-logout.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent,
    AuthGuestComponent,
    AuthRegisterComponent,
    AuthLoginComponent,
    AuthLogoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    RouterModule,
    AuthComponent,
    AuthGuestComponent,
    AuthRegisterComponent,
    AuthLoginComponent,
    AuthLogoutComponent
  ]
})
export class AuthModule {

}
