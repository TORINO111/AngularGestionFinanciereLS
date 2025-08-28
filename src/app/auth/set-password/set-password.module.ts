import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { UiModule } from 'src/app/shared/ui/ui.module';

import { SetPasswordComponent } from './set-password.component';
import { RouterModule } from '@angular/router';
import { LoginRoutingModule } from '../login/login-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    SetPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiModule,
    NgbAlertModule,
    RouterModule,
    HttpClientModule,
    LoginRoutingModule
  ]
})
export class SetPasswordModule { }
