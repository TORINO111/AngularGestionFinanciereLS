import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { RetraitsRoutingModule } from './retraits-routing.module';
import { RetraitsComponent } from './retraits.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    RetraitsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    RetraitsRoutingModule,
    NgSelectModule
  ]
})
export class RetraitsModule { }
