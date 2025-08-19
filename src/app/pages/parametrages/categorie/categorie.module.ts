import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {CategorieRoutingModule } from './categorie-routing.module';
import { CategorieComponent } from './categorie.component';


@NgModule({
  declarations: [
    CategorieComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    CategorieRoutingModule,
    ReactiveFormsModule
  ]
})
export class CategorieModule { }
