import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {GestionExerciceRoutingModule } from './gestion-exercice-routing.module';
import { GestionExerciceComponent } from './gestion-exercice.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    GestionExerciceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    GestionExerciceRoutingModule,Select2Module
  ]
})
export class GestionExerciceModule { }
