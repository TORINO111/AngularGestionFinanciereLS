import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BailleursComponent } from './bailleurs.component';

const routes: Routes = [{ path: '', component: BailleursComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BailleursRoutingModule { }
