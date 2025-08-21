import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { PaiementsRoutingModule } from './paiements-routing.module';
import { PaiementsComponent } from './paiements.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    PaiementsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    PaiementsRoutingModule,
    NgSelectModule
  ]
})
export class PaiementsModule { }
