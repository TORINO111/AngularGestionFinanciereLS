import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { RetraitsRoutingModule } from './retraits-routing.module';
import { RetraitsComponent } from './retraits.component';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  declarations: [
    RetraitsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    RetraitsRoutingModule,Select2Module
  ]
})
export class RetraitsModule { }
