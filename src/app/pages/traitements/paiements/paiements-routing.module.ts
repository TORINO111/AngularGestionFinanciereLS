import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { PaiementsComponent } from './paiements.component';

const routes: Routes = [{ path: '', component: PaiementsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaiementsRoutingModule { }
