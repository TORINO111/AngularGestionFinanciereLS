import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiModule } from 'src/app/shared/ui/ui.module';

import { LogoutRoutingModule } from './logout-routing.module';
import { LogoutComponent } from './logout.component';


@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    LogoutRoutingModule
  ]
})
export class LogoutModule { }
