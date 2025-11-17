import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametragesRoutingModule } from './parametrages-routing.module';
import { FormsModule } from '@angular/forms';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    ParametragesRoutingModule,
    FormsModule,
    DashboardModule
  ]
})
export class ParametragesModule { }
