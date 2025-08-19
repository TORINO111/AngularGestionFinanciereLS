import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtatsTresoreriesComponent } from './etats-tresoreries.component';

const routes: Routes = [{ path: '', component: EtatsTresoreriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatsTresoreriesRoutingModule { }
