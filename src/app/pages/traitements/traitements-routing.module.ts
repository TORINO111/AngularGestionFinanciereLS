import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  
{ 
  path: 'saisies-recettes',
  loadChildren: () => import('./recettes/recettes.module').then(m => m.RecettesModule),
  canActivate: [AuthGuard],
  data: { roles: ['COMPTABLE','SUPERVISEUR'] }
}
,
{ 
  path: 'saisies-depenses-immobilisees',
  loadChildren: () => import('./depenses/depenses.module').then(m => m.DepensesModule),
  canActivate: [AuthGuard],
  data: { roles: [,'COMPTABLE','SUPERVISEUR'] }
}
,
{ 
  path: 'saisies-depenses-exploitations',
  loadChildren: () => import('./depenses-exploitations/depenses-exploitations.module').then(m => m.DepensesExploitationsModule),
  canActivate: [AuthGuard],
  data: { roles: ['COMPTABLE','SUPERVISEUR'] }
}
,
{ 
  path: 'saisies-salaires',
  loadChildren: () => import('./salaires/salaires.module').then(m => m.SalairesModule),
  canActivate: [AuthGuard],
  data: { roles: ['COMPTABLE','SUPERVISEUR'] }
}
,
{ 
  path: 'saisies-encaissements',
  loadChildren: () => import('./encaissements/encaissements.module').then(m => m.EncaissementsModule),
  canActivate: [AuthGuard],
  data: { roles: ['COMPTABLE','SUPERVISEUR'] }
}
,
{ 
  path: 'saisies-decaissements',
  loadChildren: () => import('./decaissements/decaissements.module').then(m => m.DecaissementsModule),
  canActivate: [AuthGuard],
  data: { roles: ['COMPTABLE','SUPERVISEUR'] }
}
,
{ 
  path: 'saisies-retraits',
  loadChildren: () => import('./retraits/retraits.module').then(m => m.RetraitsModule),
  canActivate: [AuthGuard],
  data: { roles: ['COMPTABLE','SUPERVISEUR'] }
}
  ,
  {
    path: '',
    redirectTo: 'saisies-recettes',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: { roles: ['COMPTABLE','SUPERVISEUR'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraitementsRoutingModule { }
