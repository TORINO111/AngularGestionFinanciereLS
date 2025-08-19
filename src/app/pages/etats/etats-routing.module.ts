import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
const routes: Routes = [

  { 
    path: 'etats-depenses',
    loadChildren: () => import('./etats-depenses/etats-depenses.module').then(m => m.EtatsDepensesModule),
    canActivate: [AuthGuard],
    data: { roles: ['COMPTABLE','SUPERVISEUR'] }
   },
  { 
    path: 'etats-recettes',
    loadChildren: () => import('./etats-recettes/etats-recettes.module').then(m => m.EtatsRecettesModule),
    canActivate: [AuthGuard],
    data: { roles: ['COMPTABLE','SUPERVISEUR'] }
   },
  { 
    path: 'etats-tresoreries',
    loadChildren: () => import('./etats-tresoreries/etats-tresoreries.module').then(m => m.EtatsTresoreriesModule),
    canActivate: [AuthGuard],
    data: { roles: ['COMPTABLE','SUPERVISEUR'] }
   }
   ,
   { 
     path: 'ecritures-comptables',
     loadChildren: () => import('./ecritures-comptables/ecritures-comptables.module').then(m => m.EcrituresComptablesModule),
     canActivate: [AuthGuard],
     data: { roles: ['COMPTABLE','SUPERVISEUR'] }
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatsRoutingModule { }
