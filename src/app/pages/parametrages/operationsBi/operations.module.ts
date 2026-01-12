import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponentBi } from './operations.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    OperationsComponentBi  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageTitleModule,
    OperationsRoutingModule,
    NgSelectModule
  ]
})
export class OperationsModuleBi { }
