import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {CompteRoutingModule } from './compte-routing.module';
import { CompteComponent } from './compte.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    CompteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    CompteRoutingModule,Select2Module
  ]
})
export class CompteModule { }
