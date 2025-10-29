import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { CohortesRoutingModule } from './cohortes-routing.module';
import { CohortesComponent } from './cohortes.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CohortesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    CohortesRoutingModule,
    NgSelectModule
  ]
})
export class CohortesModule { }
