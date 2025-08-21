import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { GestionExerciceRoutingModule } from './gestion-exercice-routing.module';
import { GestionExerciceComponent } from './gestion-exercice.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    GestionExerciceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    PageTitleModule,
    GestionExerciceRoutingModule,
    NgSelectModule
  ]
})
export class GestionExerciceModule { }
