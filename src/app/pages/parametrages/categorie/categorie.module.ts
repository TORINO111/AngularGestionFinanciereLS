import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {CategorieRoutingModule } from './categorie-routing.module';
import { CategorieComponent } from './categorie.component';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CategorieComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    CategorieRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModalModule
  ]
})
export class CategorieModule { }
