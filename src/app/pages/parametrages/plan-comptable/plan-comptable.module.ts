import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {PlanComptableRoutingModule } from './plan-comptable-routing.module';
import { PlanComptableComponent } from './plan-comptable.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    PlanComptableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    PlanComptableRoutingModule,Select2Module
  ]
})
export class PlanComptableModule { }
