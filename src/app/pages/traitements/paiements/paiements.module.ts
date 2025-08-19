import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { PaiementsRoutingModule } from './paiements-routing.module';
import { PaiementsComponent } from './paiements.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    PaiementsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    PaiementsRoutingModule,Select2Module
  ]
})
export class PaiementsModule { }
