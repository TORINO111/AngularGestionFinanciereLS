import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { loggedInUser } from './core/helpers/utils';
import { EventService } from './core/service/event.service';
import { LayoutContainerComponent } from './layout/layout-container.component';
import { SetPasswordComponent } from './auth/set-password/set-password.component';


const rootRoute = loggedInUser() ? 'traitements/graphiques' : 'auth/login';
//const rootRoute = loggedInUser() ? 'dashboard/ecommerce' : 'landing';

const routes: Routes = [
  { path: 'auth/set-password', component: SetPasswordComponent },
  {
    path: '',
    redirectTo: rootRoute,
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutContainerComponent,
    //component: LayoutContainerComponent,
    //canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
      }
    ]
  },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
  providers: [EventService]
})
export class AppRoutingModule { }
