import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {PlanAnalytiqueRoutingModule } from './plan-analytique-routing.module';
import { PlanAnalytiqueComponent } from './plan-analytique.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    PlanAnalytiqueComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    PlanAnalytiqueRoutingModule,
    NgSelectModule
  ]
})
export class PlanAnalytiqueModule { }
