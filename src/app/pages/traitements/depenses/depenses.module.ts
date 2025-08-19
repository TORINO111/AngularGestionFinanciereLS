import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { DepensesRoutingModule } from './depenses-routing.module';
import { DepensesComponent } from './depenses.component';
import { Select2Module } from 'ng-select2-component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    DepensesComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    DepensesRoutingModule,ReactiveFormsModule,Select2Module
  ]
})
export class DepensesModule { }
