import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { BailleursRoutingModule } from './bailleurs-routing.module';
import { BailleursComponent } from './bailleurs.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    BailleursComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    BailleursRoutingModule,
    NgSelectModule
  ]
})
export class BailleursModule { }
