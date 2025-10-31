import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthenticationService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
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
        console.log("expectedRole: ", expectedRoles);
        const userRole: string | null = sessionStorage.getItem('role');
        console.log("userRole: ", userRole);

        const hasAccess = expectedRoles.includes(userRole || '');

        if (!hasAccess) {
            this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        return true;
    }

}
