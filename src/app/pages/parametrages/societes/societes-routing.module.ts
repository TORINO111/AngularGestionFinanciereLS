import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SocietesComponent } from './societes.component';

const routes: Routes = [{ path: '', component: SocietesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocietesRoutingModule { }
