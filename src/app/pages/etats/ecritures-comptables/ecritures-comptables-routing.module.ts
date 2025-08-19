import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcrituresComptablesComponent } from './ecritures-comptables.component';

const routes: Routes = [{ path: '', component: EcrituresComptablesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcrituresComptablesRoutingModule { }
