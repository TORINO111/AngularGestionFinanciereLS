import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {EtatsRecettesRoutingModule } from './etats-recettes-routing.module';
import { EtatsRecettesComponent } from './etats-recettes.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    EtatsRecettesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    EtatsRecettesRoutingModule,
    NgSelectModule
  ]
})
export class EtatsRecettesModule { }
