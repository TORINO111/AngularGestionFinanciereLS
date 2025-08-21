import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {NatureOperationsRoutingModule } from './nature-operations-routing.module';
import { NatureOperationsComponent } from './nature-operations.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    NatureOperationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    NatureOperationsRoutingModule,
    NgSelectModule
  ]
})
export class NatureOperationsModule { }
