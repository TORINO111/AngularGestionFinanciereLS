import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { TresoreriesRoutingModule } from './tresoreries-routing.module';
import { TresoreriesComponent } from './tresoreries.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    TresoreriesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    TresoreriesRoutingModule,
    NgSelectModule
  ]
})
export class TresoreriesModule { }
