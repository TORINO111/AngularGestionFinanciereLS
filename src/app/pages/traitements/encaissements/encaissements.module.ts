import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { EncaissementsRoutingModule } from './encaissements-routing.module';
import { EncaissementsComponent } from './encaissements.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    EncaissementsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    EncaissementsRoutingModule,Select2Module
  ]
})
export class EncaissementsModule { }
