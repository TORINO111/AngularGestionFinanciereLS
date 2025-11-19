import { CodeJournalModule } from './code-journal/code-journal.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
const routes: Routes = [

  {
    path: 'operations',   
    loadChildren: () => import('./operations/operations.module').then(m => m.OperationsModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'categories',
    loadChildren: () => import('./categorie/categorie.module').then(m => m.CategorieModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'societes',
    loadChildren: () => import('./societes/societes.module').then(m => m.SocietesModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'BAILLEUR', 'CLIENT_ADMIN'] }
  },

  // {
  //   path: 'cabinets',
  //   loadChildren: () => import('./cabinets/cabinets.module').then(m => m.CabinetsModule),
  //   canActivate: [AuthGuard],
  //   data: { roles: ['SUPERVISEUR', 'ADMIN'] }
  // },
  {
    path: 'informations-cabinet',
    loadChildren: () => import('./informations-societe/informations-societe.module').then(m => m.InformationsSocieteModule),
    canActivate: [AuthGuard],
    data: { roles: ['SUPERVISEUR'] }
  },
  {
    path: 'utilisateurs',
    loadChildren: () => import('./utilisateurs/utilisateurs.module').then(m => m.UtilisateursModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'SUPERVISEUR', 'ENTREPRISE_ADMIN'] }
  },
  {
    path: 'mon-compte',
    loadChildren: () => import('./compte/compte.module').then(m => m.CompteModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'SUPERVISEUR', 'COMPTABLE', 'CLIENT_ADMIN', 'CLIENT_AGENT', 'ENTREPRISE_ADMIN', 'ENTREPRISE_USER'] }
  },
  {
    path: 'tiers',
    loadChildren: () => import('./tiers/tiers.module').then(m => m.TiersModule),
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE_ADMIN', 'ENTREPRISE_USER'] }
  },
  {
    path: 'bailleurs',
    loadChildren: () => import('./bailleurs/bailleurs.module').then(m => m.BailleursModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'CLIENT_ADMIN', 'CLIENT_AGENT'] }
  },
  {
    path: 'cohortes',
    loadChildren: () => import('./cohortes/cohortes.module').then(m => m.CohortesModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'CLIENT_ADMIN', 'CLIENT_AGENT', 'BAILLEUR'] }
  },
  {
    path: 'clients-numexis',
    loadChildren: () => import('./clients-numexis/clients-numexis.module').then(m => m.ClientsNumexisModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'articles',
    loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule),
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE_ADMIN', 'ENTREPRISE_USER'] }
  },
  {
    path: 'plan-comptable',
    loadChildren: () => import('./plan-comptable/plan-comptable.module').then(m => m.PlanComptableModule),
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE_ADMIN', 'ENTREPRISE_USER'] }
  },
  {
    path: 'comptes-comptables',
    loadChildren: () => import('./comptes-comptables/comptes-comptables.module').then(m => m.CompteComptableModule),
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE_ADMIN', 'ENTREPRISE_USER'] }
  },
  {
    path: 'plan-analytique',
    loadChildren: () => import('./plan-analytique/plan-analytique.module').then(m => m.PlanAnalytiqueModule),
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE_ADMIN', 'ENTREPRISE_USER'] }
  },
  {
    path: 'sections-analytiques',
    loadChildren: () => import('./sections-analytiques/sections-analytiques.module').then(m => m.SectionsAnalytiquesModule),
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE_ADMIN', 'ENTREPRISE_USER'] }
  },
  {
    path: 'journaux',
    loadChildren: () => import('./code-journal/code-journal.module').then(m => m.CodeJournalModule),
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE_ADMIN', 'ENTREPRISE_USER'] }
  },
  {
    path: 'exercice-comptable',
    loadChildren: () => import('./gestion-exercice/gestion-exercice.module').then(m => m.GestionExerciceModule),
    canActivate: [AuthGuard],
    data: { roles: ['ENTREPRISE_ADMIN'] }
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'CLIENT_ADMIN', 'CLIENT_AGENT', 'BAILLEUR', 'ENTREPRISE_ADMIN', 'ENTREPRISE_USER'] }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametragesRoutingModule { }
