import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'traitements',
    pathMatch: 'full'
  },
  
  { path: 'traitements', loadChildren: () => import('./traitements/traitements.module').then(m => m.TraitementsModule) },
  { path: 'parametrages', loadChildren: () => import('./parametrages/parametrages.module').then(m => m.ParametragesModule) },
  { path: 'etats', loadChildren: () => import('./etats/etats.module').then(m => m.EtatsModule) }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
