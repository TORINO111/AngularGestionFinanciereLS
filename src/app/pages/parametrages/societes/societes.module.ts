import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import {SocietesRoutingModule } from './societes-routing.module';
import { SocietesComponent } from './societes.component';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    SocietesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    SocietesRoutingModule,
    NgSelectModule
  ]
})
export class SocietesModule { }
