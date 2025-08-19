import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { RecoverPasswordRoutingModule } from './recover-password-routing.module';
import { RecoverPasswordComponent } from './recover-password.component';



@NgModule({
  declarations: [
    RecoverPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    UiModule,
    RecoverPasswordRoutingModule
  ]
})
export class RecoverPasswordModule { }
