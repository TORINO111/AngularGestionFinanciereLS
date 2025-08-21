import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {PlanComptableRoutingModule } from './plan-comptable-routing.module';
import { PlanComptableComponent } from './plan-comptable.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    PlanComptableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    PlanComptableRoutingModule,
    NgSelectModule
  ]
})
export class PlanComptableModule { }
