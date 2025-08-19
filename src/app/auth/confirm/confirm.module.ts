import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmRoutingModule } from './confirm-routing.module';
import { ConfirmComponent } from './confirm.component';


@NgModule({
  declarations: [
    ConfirmComponent
  ],
  imports: [
    CommonModule,ReactiveFormsModule,
    UiModule,
    ConfirmRoutingModule
  ]
})
export class ConfirmModule { }
