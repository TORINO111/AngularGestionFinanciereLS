import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponent } from './operations.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    OperationsComponent  
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
export class OperationsModule { }
