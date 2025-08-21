import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {EcrituresComptablesRoutingModule } from './ecritures-comptables-routing.module';
import { EcrituresComptablesComponent } from './ecritures-comptables.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    EcrituresComptablesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    EcrituresComptablesRoutingModule,
    NgSelectModule
  ]
})
export class EcrituresComptablesModule { }
