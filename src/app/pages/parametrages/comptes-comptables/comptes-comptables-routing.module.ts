import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComptesComptablesComponent } from './comptes-comptables.component';

const routes: Routes = [{ path: '', component: ComptesComptablesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptesComptablesRoutingModule { }
