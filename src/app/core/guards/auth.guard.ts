import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
    ) { }

    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //     const expectedRoles: string[] = route.data['roles'] || [];
    //     const userRoles: string[] = this.authenticationService.getRolesFromToken() || [];

    //     // Typage explicite du paramètre 'role'
    //     const hasAccess = expectedRoles.some((role: string) => userRoles.includes(role));

    //     if (!hasAccess) {
    //         // Redirection en cas d'accès refusé
    //         this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
    //         return false;
    //     }

    //     return true;
    // }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const expectedRoles: string[] = route.data['roles'];
        const userRole: string | null = sessionStorage.getItem('role');
        const hasAccess = expectedRoles.includes(userRole || '');

        if (!hasAccess) {
            this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        return true;
    }

}
