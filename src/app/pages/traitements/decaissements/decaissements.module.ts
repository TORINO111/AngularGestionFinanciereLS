import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { DecaissementsRoutingModule } from './decaissements-routing.module';
import { DecaissementsComponent } from './decaissements.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    DecaissementsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    DecaissementsRoutingModule,
    NgSelectModule
  ]
})
export class DecaissementsModule { }
