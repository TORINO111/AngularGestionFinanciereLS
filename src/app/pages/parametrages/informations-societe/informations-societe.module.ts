import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {InformationsSocieteRoutingModule } from './informations-societe-routing.module';
import { InformationsSocieteComponent } from './informations-societe.component';


@NgModule({
  declarations: [
    InformationsSocieteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    InformationsSocieteRoutingModule
  ]
})
export class InformationsSocieteModule { }
