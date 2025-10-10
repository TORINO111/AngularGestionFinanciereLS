import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/auth.models';
import { loggedInUser } from '../helpers/utils';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  user: User | null = null;
  private host = `${environment.apiUrl}/api`;
  private roles: any;
  private jwtToken: any;
  private refreshToken!: string;
  helper = new JwtHelperService();
  current_user_roles: string[];

  constructor(private _http: HttpClient, private router: Router) { }

  /** -------------------- Gestion du token -------------------- */
  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return token.startsWith('Bearer') ? token.slice(7) : token;
  }

  getRefreshToken() {
    return this.refreshToken || localStorage.getItem('refreshToken');
  }

  refreshTokenRequest(): Observable<any> {
    return this._http.post(`${this.host}/auth/refresh`, { refreshToken: this.getRefreshToken() });
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /*saveToken(authHeader: string) {
    if (!authHeader) {
      console.error("Token manquant !");
      return;
    }

    const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    this.jwtToken = jwt;
    localStorage.setItem('token', jwt);

    let decoded: any;
    try {
      decoded = this.helper.decodeToken(jwt);
    } catch (err) {
      console.error("Impossible de décoder le token :", err);
      this.current_user_roles = [];
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('roles');
      return;
    }

    // Extraire les rôles
    this.current_user_roles = decoded.roles?.map((r: any) => typeof r === 'string' ? r : r.libelle) || [];

    // Déterminer le rôle principal
    const rolePriority: { [key: string]: string } = { 'ADMIN': 'a', 'SUPERVISEUR': 'b', 'COMPTABLE': 'c' };
    const mainRole = ['ADMIN', 'SUPERVISEUR', 'COMPTABLE'].find(r => this.current_user_roles.includes(r)) || '';

    sessionStorage.setItem('role', rolePriority[mainRole] || '');
    sessionStorage.setItem('roles', JSON.stringify(this.current_user_roles));
  }*/

  saveTokens(token: string, refreshToken: string) {
    if (!token) {
      console.error("Token manquant !");
      return;
    }

    const jwt = token.startsWith('Bearer') ? token.slice(7) : token;
    this.jwtToken = jwt;
    this.refreshToken = refreshToken;

    // Sauvegarde locale
    localStorage.setItem('token', jwt);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    let decoded: any;
    try {
      decoded = this.helper.decodeToken(jwt);
    } catch (err) {
      console.error("Impossible de décoder le token :", err);
      this.current_user_roles = [];
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('roles');
      return;
    }

    // Extraire les rôles
    this.current_user_roles = decoded.roles?.map((r: any) => typeof r === 'string' ? r : r.libelle) || [];

    // Déterminer le rôle principal
    const rolePriority: { [key: string]: string } = { 'ADMIN': 'a', 'SUPERVISEUR': 'b', 'COMPTABLE': 'c' };
    const mainRole = ['ADMIN', 'SUPERVISEUR', 'COMPTABLE'].find(r => this.current_user_roles.includes(r)) || '';

    sessionStorage.setItem('role', rolePriority[mainRole] || '');
    sessionStorage.setItem('roles', JSON.stringify(this.current_user_roles));
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.user = null;
    this.router.navigate(['/auth/login']);
  }

  /** -------------------- Authentification -------------------- */
  login(utilisateur: any) {
    return this._http.post(`${this.host}/auth/login`, utilisateur, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      observe: 'response'
    });
  }

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

  signup(name: string, email: string, password: string): any {
    return this._http.post<any>(`${this.host}/signup`, { name, email, password })
      .pipe(map(user => user));
  }

  /** -------------------- Utilisateurs -------------------- */
  currentUser(): User | null {
    if (!this.user) this.user = loggedInUser();
    return this.user;
  }

  getUserByUsername(username: string) {
    const token = this.getToken();
    if (!token) throw new Error('Token manquant');

    return this._http.get(`${this.host}/utilisateur-username?username=${username}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    });
  }

  getUserByEmail(email: string) {
    const token = this.getToken();
    if (!token) throw new Error('Token manquant');

    return this._http.get(`${this.host}/utilisateur?email=${email}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // 🔹 Préfixe Bearer obligatoire
      })
    });
  }

  /** -------------------- Password & Reset -------------------- */
  sendResetPassword(email: string) {
    return this._http.get(`${this.host}/forgot?email=${email}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  sendNewPassword(password: any, token: any) {
    return this._http.post(`${this.host}/reset?password=${password}&token=${token}`, {}, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  sendPassword(mn: any) {
    return this._http.post(`${this.host}/new-password`, mn, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  resetPasswordWhatsApp(telephone: string) {
    return this._http.post(`${this.host}/auth/request-reset`, { telephone }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  renouvelerMotDePasse(payload: any) {
    return this._http.post(`${this.host}/reset-password`, payload, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  /** -------------------- Rôles -------------------- */
  getRolesFromToken(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.roles) return [];

    if (typeof payload.roles[0] === 'string') return payload.roles;
    return payload.roles.filter((auth: any) => auth && auth.authority).map((auth: any) => auth.authority);
  }

  isAdmin() { return sessionStorage.getItem('role') === 'a'; }
  isSuperviseur() { return sessionStorage.getItem('role') === 'b'; }
  isComptable() { return sessionStorage.getItem('role') === 'c'; }

  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

}



