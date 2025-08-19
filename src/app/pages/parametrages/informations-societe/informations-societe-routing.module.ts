import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationsSocieteComponent } from './informations-societe.component';

const routes: Routes = [{ path: '', component: InformationsSocieteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationsSocieteRoutingModule { }
