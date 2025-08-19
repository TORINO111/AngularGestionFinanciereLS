import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanAnalytiqueComponent } from './plan-analytique.component';

const routes: Routes = [{ path: '', component: PlanAnalytiqueComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanAnalytiqueRoutingModule { }
