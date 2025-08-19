import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {EtatsRecettesRoutingModule } from './etats-recettes-routing.module';
import { EtatsRecettesComponent } from './etats-recettes.component';
import { Select2Module } from 'ng-select2-component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EtatsRecettesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    EtatsRecettesRoutingModule,Select2Module
  ]
})
export class EtatsRecettesModule { }
