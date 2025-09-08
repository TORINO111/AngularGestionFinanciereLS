import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ComptesComptablesRoutingModule } from './comptes-comptables-routing.module';
import { ComptesComptablesComponent } from './comptes-comptables.component';
import { NgSelectModule } from '@ng-select/ng-select'; 


@NgModule({
  declarations: [
    ComptesComptablesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ComptesComptablesRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class CompteComptableModule { }
