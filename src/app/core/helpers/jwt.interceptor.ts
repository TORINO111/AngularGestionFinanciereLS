// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { Observable } from 'rxjs';

// import { AuthenticationService } from '../service/auth.service';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//     constructor(private authenticationService: AuthenticationService) { }

//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         // add authorization header with jwt token if available
//         const currentUser = this.authenticationService.currentUser();
//         if (currentUser && currentUser.token) {
//             request = request.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${currentUser.token}`
//                 }
//             });
//         }

//         return next.handle(request);
//     }
// }
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthenticationService } from '../service/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.authenticationService.getToken();

        // Vérifier si le token existe et s'il est expiré
        if (token && this.authenticationService.helper.isTokenExpired(token)) {
            // Si expiré -> refresh avant d'envoyer la requête
            return this.authenticationService.refreshTokenRequest().pipe(
                switchMap((res: any) => {
                    // Sauvegarde le nouveau token et refreshToken
                    this.authenticationService.saveTokens(res.token, res.refreshToken);
                    token = res.token;

                    // Cloner la requête avec le nouveau token
                    const clonedReq = request.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return next.handle(clonedReq);
                }),
                catchError(err => {
                    // Si refresh échoue -> logout
                    this.authenticationService.logout();
                    this.router.navigate(['/auth/login']);
                    return throwError(() => err);
                })
            );
        }

        // Si token valide -> ajouter Authorization header
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError(err => {
                // Si le backend renvoie 401 malgré tout, forcer logout
                if (err.status === 401) {
                    this.authenticationService.logout();
                }
                return throwError(() => err);
            })
        );
    }
}
