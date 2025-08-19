import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NatureOperationsComponent } from './nature-operations.component';

const routes: Routes = [{ path: '', component: NatureOperationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NatureOperationsRoutingModule { }
