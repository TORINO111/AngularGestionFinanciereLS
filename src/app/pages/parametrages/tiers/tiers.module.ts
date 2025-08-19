import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {TiersRoutingModule } from './tiers-routing.module';
import { TiersComponent } from './tiers.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    TiersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    TiersRoutingModule,Select2Module
  ]
})
export class TiersModule { }
