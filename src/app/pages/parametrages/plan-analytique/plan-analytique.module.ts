import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {PlanAnalytiqueRoutingModule } from './plan-analytique-routing.module';
import { PlanAnalytiqueComponent } from './plan-analytique.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    PlanAnalytiqueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    PlanAnalytiqueRoutingModule,Select2Module
  ]
})
export class PlanAnalytiqueModule { }
