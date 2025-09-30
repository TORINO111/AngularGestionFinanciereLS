import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EcrituresComponent } from './ecritures.component';

const routes: Routes = [{ path: '', component: EcrituresComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcrituresRoutingModule { }
