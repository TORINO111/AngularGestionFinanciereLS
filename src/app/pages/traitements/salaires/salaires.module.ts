import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SalairesRoutingModule } from './salaires-routing.module';
import { SalairesComponent } from './salaires.component';
import { Select2Module } from 'ng-select2-component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    SalairesComponent 
  ],
  imports: [
    CommonModule,
    PageTitleModule ,
    SalairesRoutingModule,ReactiveFormsModule,Select2Module
  ]
})
export class SalairesModule { }
