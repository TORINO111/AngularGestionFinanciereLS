import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { RecettesRoutingModule } from './recettes-routing.module';
import { RecettesComponent } from './recettes.component';
import { Select2Module } from 'ng-select2-component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    RecettesComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,ReactiveFormsModule,
    RecettesRoutingModule,Select2Module
  ]
})
export class RecettesModule { }
