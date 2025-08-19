import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { DecaissementsComponent } from './decaissements.component';

const routes: Routes = [{ path: '', component: DecaissementsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DecaissementsRoutingModule { }
