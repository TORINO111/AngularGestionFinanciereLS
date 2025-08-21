import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthenticationService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const expectedRoles: string[] = route.data['roles'] || [];
        const userRoles: string[] = this.authenticationService.getRolesFromToken() || [];
        /*const currentUser = this.authenticationService.currentUser();
        if (currentUser) {
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
        return false;*/

        // Typage explicite du paramètre 'role'
        const hasAccess = expectedRoles.some((role: string) => userRoles.includes(role));

        if (!hasAccess) {
            // Redirection en cas d'accès refusé
            this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        return true;
    }
}
