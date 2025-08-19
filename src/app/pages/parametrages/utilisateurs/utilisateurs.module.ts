import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateursRoutingModule } from './utilisateurs-routing.module';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { UtilisateursComponent } from './utilisateurs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [
    UtilisateursComponent
  ],
  imports: [
    CommonModule,PageTitleModule,
    UtilisateursRoutingModule,NgxPaginationModule,ReactiveFormsModule
  ]
})
export class UtilisateursModule { }
