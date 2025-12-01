import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeJournalComponent } from './type-journal.component'; // Renamed import and class

const routes: Routes = [{ path: '', component: TypeJournalComponent }]; // Renamed component

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeJournalRoutingModule { }
