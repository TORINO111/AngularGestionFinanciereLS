import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {CabinetsRoutingModule } from './cabinets-routing.module';
import { CabinetsComponent } from './cabinets.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    CabinetsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    CabinetsRoutingModule,Select2Module
  ]
})
export class CabinetsModule { }
