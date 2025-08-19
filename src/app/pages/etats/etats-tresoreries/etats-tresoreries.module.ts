import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {EtatsTresoreriesRoutingModule } from './etats-tresoreries-routing.module';
import { EtatsTresoreriesComponent } from './etats-tresoreries.component';
import { Select2Module } from 'ng-select2-component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EtatsTresoreriesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    EtatsTresoreriesRoutingModule,Select2Module
  ]
})
export class EtatsTresoreriesModule { }
