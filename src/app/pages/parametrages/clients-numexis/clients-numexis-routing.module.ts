import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsNumexisComponent } from './clients-numexis.component';

const routes: Routes = [{ path: '', component: ClientsNumexisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsNumexisRoutingModule { }
