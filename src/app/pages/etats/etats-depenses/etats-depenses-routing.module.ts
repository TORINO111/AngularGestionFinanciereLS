import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtatsDepensesComponent } from './etats-depenses.component';

const routes: Routes = [{ path: '', component: EtatsDepensesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatsDepensesRoutingModule { }
