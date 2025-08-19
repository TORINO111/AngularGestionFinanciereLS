import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtatsRecettesComponent } from './etats-recettes.component';

const routes: Routes = [{ path: '', component: EtatsRecettesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatsRecettesRoutingModule { }
