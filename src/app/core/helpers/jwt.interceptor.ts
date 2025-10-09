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

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Récupérer le token via le service
        const token = this.authenticationService.getToken();

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401) {
                    // Tentative de refresh
                    return this.authenticationService.refreshTokenRequest().pipe(
                        switchMap((res: any) => {
                            this.authenticationService.saveTokens(res.token, res.refreshToken);
                            request = request.clone({
                                setHeaders: { Authorization: `Bearer ${res.token}` }
                            });
                            return next.handle(request);
                        }),
                        catchError(innerErr => {
                            // Si refresh échoue -> logout
                            localStorage.removeItem('token');
                            localStorage.removeItem('refreshToken');
                            return throwError(() => innerErr);
                        })
                    );
                }
                return throwError(() => err);
            })
        );
    }
}
