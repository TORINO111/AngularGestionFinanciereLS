import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/auth.models';
import { loggedInUser } from '../helpers/utils';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, ActivatedRoute } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null;
  private host = `${environment.apiUrl}/api`;


  //private host:String="http://localhost:8082";
  //private host:string='http://4.222.22.46:8082/gest-fin';
  //private host:String="//4.222.22.46:8082/gest-fin";

  private roles: any;
  private jwtToken: any;
  helper = new JwtHelperService();
  current_user_roles: string[];
  constructor(private _http: HttpClient, private router: Router) { }

  /**
   * Returns the current user
   */
  public currentUser(): User | null { 
    if (!this.user) {
      this.user = loggedInUser();
    }
    return this.user;
  }

  getUserRoles(): string[] {
    return this.current_user_roles;
  }

  getRoles(): string[] {
    const authorities = [{ authority: 'ADMIN' }]; // Exemple des rôles
    return authorities.map(auth => auth.authority); // Transformation en tableau de string
  }

  getRolesFromToken(): string[] {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décodage JWT
      if (!payload.roles) return [];

      // Si roles est un tableau de chaînes, retourne tel quel
      if (typeof payload.roles[0] === 'string') return payload.roles;

      // Si roles est un tableau d'objets {authority: string}, map comme avant
      return payload.roles
        .filter((auth: any) => auth && auth.authority)
        .map((auth: any) => auth.authority);
    }
    return [];
  }



  /**
   * Performs the login auth
   * @param email email of user
   * @param password password of user
   */
  loginn(email: string, password: string): any {

    return this._http.post<any>(`${this.host}/auth/login`, { email, password })
      .pipe(map(user => {
        if (user && user.token) {
          this.user = user;
          sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
        return user;
      }));
  }

  login(utilisateur: any) {

    return this._http.post(`${this.host}/auth/login`, utilisateur, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      observe: 'response'
    });
  }

  /**
   * Performs the signup auth
   * @param name name of user
   * @param email email of user
   * @param password password of user
   */
  signup(name: string, email: string, password: string): any {
    return this._http.post<any>(`${this.host}/signup`, { name, email, password })
      .pipe(map(user => user));

  }



  /**
   * Logout the user
   */
  logout(): void {

    // remove user from session storage to log user out
    sessionStorage.removeItem('currentUser');
    this.user = null;

    let removeToken = localStorage.removeItem('token');
    sessionStorage.clear();
    localStorage.clear();
    if (removeToken == null) {
      this.router.navigate(['auth/login']);
    }
  }


  saveToken(jwt: string) {
    if (!jwt) {
      console.error("Token vide ou invalide !");
      return;
    }

    this.jwtToken = jwt;
    localStorage.setItem('token', jwt);

    const helper = new JwtHelperService();
    let decoded: any;
    try {
      decoded = helper.decodeToken(this.jwtToken);
    } catch (err) {
      console.error("Impossible de décoder le token :", err);
      this.current_user_roles = [];
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('roles');
      return;
    }

    // Vérifie que decoded.roles existe et est un tableau
    if (!decoded.roles || !Array.isArray(decoded.roles)) {
      console.error("Roles manquants ou invalides dans le token !");
      this.current_user_roles = [];
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('roles');
      return;
    }

    // Récupère les libellés des rôles
    this.current_user_roles = decoded.roles.map((r: any) => {
      return typeof r === 'string' ? r : r.libelle;
    });

    // Détermine le rôle principal selon la priorité ADMIN > SUPERVISEUR > COMPTABLE
    const rolePriority: { [key: string]: string } = {
      'ADMIN': 'a',
      'SUPERVISEUR': 'b',
      'COMPTABLE': 'c'
    };

    let mainRole = '';
    for (const r of ['ADMIN', 'SUPERVISEUR', 'COMPTABLE']) {
      if (this.current_user_roles.includes(r)) {
        mainRole = rolePriority[r];
        break;
      }
    }

    sessionStorage.setItem('role', mainRole);
    sessionStorage.setItem('roles', JSON.stringify(this.current_user_roles));
  }




  isAdmin() {
    let role = sessionStorage.getItem('role');
    //console.log(role)
    if (role == null || undefined) {
      this.router.navigate(['/auth/login']);
    }

    if (role === 'a') return true;

    return false;
  }

  isSuperviseur() {
    let role = sessionStorage.getItem('role');
    if (role == null || undefined) {
      this.router.navigate(['/auth/login']);
    }

    if (role == 'b') return true;

    return false;
  }

  isComptable() {
    let role = sessionStorage.getItem('role');
    if (role == null || undefined) {
      this.router.navigate(['/auth/login']);

    }

    if (role == 'c') return true;

    return false;
  }


  /* saveToken(jwt:string){
     console.log(jwt)
     localStorage.setItem('token',jwt);
     console.log(localStorage.getItem('token'))
   }*/

  public getToken(): any {
    return localStorage.getItem('token');
  }
  loadToken() {
    this.jwtToken = localStorage.getItem('token');
  }


  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('token');
    return (authToken !== null) ? true : false;
  }
  logout2() {
    let removeToken = localStorage.removeItem('token');
    /*sessionStorage.removeItem('user');
    sessionStorage.removeItem('database');
    localStorage.removeItem('database');
    localStorage.removeItem('user');
    sessionStorage.removeItem('role');
    localStorage.removeItem('role');*/
    sessionStorage.clear();
    localStorage.clear();
    if (removeToken == null) {
      this.router.navigate(['/login']);
    }
  }

  getUserByUsername(username: string) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token manquant');
    //console.log(token)
    return this._http.get(`${this.host}/utilisateur-username?username=` + username, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', token) // Ajoute le token dans l'Authorization header
    });
  }
  getUserByEmail(email: string) {
    const token = localStorage.getItem('token'); // Récupère le token stocké
    if (!token) throw new Error('Token manquant');
    //console.log(token)
    return this._http.get(this.host + '/api/utilisateur?email=' + email, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', token) // Ajoute le token dans l'Authorization header
    });
  }
  sendResetPassword(email: string) {
    return this._http.get(this.host + '/api/forgot?email=' + email, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
  sendNewPassword(password: any, token: any) {
    return this._http.post(this.host + '/api/reset?password=' + password + '&token=' + token, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  sendPassword(mn: any) {
    return this._http.post(this.host + '/api/new-password', mn, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  resetPasswordWhatsApp(telephone: String) {
    return this._http.post(this.host + '/api/auth/request-reset', { telephone }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
  renouvelerMotDePasse(payload: any) {
    return this._http.post(this.host + '/api/reset-password', payload, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }


}



