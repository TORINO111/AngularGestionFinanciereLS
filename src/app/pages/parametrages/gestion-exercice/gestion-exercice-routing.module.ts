import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionExerciceComponent } from './gestion-exercice.component';

const routes: Routes = [{ path: '', component: GestionExerciceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionExerciceRoutingModule { }
