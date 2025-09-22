import { SectionsAnalytiquesComponent } from './sections-analytiques.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: SectionsAnalytiquesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectionAnalytiqueRoutingModule { }
