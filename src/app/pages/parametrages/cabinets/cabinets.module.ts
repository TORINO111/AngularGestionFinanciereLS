import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {CabinetsRoutingModule } from './cabinets-routing.module';
import { CabinetsComponent } from './cabinets.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    CabinetsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    CabinetsRoutingModule,
    NgSelectModule
  ]
})
export class CabinetsModule { }
