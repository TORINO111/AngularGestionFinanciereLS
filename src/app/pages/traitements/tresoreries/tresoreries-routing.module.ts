import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { TresoreriesComponent } from './tresoreries.component';

const routes: Routes = [{ path: '', component: TresoreriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TresoreriesRoutingModule { }
