import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor (
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        /*const currentUser = this.authenticationService.currentUser();
        if (currentUser) {
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
        return false;*/

        const expectedRoles = route.data['roles'];
        const userRoles = this.authenticationService.getRolesFromToken();

        const hasAccess = expectedRoles.some(role => userRoles.includes(role));

        if (!hasAccess) {
        this.router.navigate(
            //['/unauthorized']
            ['auth/login'], { queryParams: { returnUrl: state.url } }); // Redirection en cas d'accès refusé
        return false;
        }
        return true;
    }
}