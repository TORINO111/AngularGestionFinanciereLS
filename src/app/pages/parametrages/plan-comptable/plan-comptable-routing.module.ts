import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanComptableComponent } from './plan-comptable.component';

const routes: Routes = [{ path: '', component: PlanComptableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanComptableRoutingModule { }
