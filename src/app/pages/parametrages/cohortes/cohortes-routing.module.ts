import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CohortesComponent } from './cohortes.component';

const routes: Routes = [{ path: '', component: CohortesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CohortesRoutingModule { }
