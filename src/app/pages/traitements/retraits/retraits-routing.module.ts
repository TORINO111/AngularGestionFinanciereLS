import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { RetraitsComponent } from './retraits.component';

const routes: Routes = [{ path: '', component: RetraitsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetraitsRoutingModule { }
