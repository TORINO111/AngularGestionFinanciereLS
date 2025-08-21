import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { DepensesRoutingModule } from './depenses-routing.module';
import { DepensesComponent } from './depenses.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

import { FormsModule,ReactiveFormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    DepensesComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    DepensesRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule
  ]
})
export class DepensesModule { }
