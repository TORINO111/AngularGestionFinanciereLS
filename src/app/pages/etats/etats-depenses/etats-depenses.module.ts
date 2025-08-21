import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { EtatsDepensesRoutingModule } from './etats-depenses-routing.module';
import { EtatsDepensesComponent } from './etats-depenses.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EtatsDepensesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    EtatsDepensesRoutingModule,
    NgSelectModule
  ]
})
export class EtatsDepensesModule { }
