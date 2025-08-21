import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SalairesRoutingModule } from './salaires-routing.module';
import { SalairesComponent } from './salaires.component';
//import { Select2Module } from 'ng-select2-component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    SalairesComponent 
  ],
  imports: [
    CommonModule,
    PageTitleModule ,
    SalairesRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule
  ]
})
export class SalairesModule { }
