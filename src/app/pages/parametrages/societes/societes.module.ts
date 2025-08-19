import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {SocietesRoutingModule } from './societes-routing.module';
import { SocietesComponent } from './societes.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    SocietesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    SocietesRoutingModule,Select2Module
  ]
})
export class SocietesModule { }
