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

  constructor(private _http: HttpClient, private router: Router) { }

  /** -------------------- Gestion du token -------------------- */
  getToken(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    return token.startsWith('Bearer') ? token.slice(7) : token;
  }

  getRefreshToken() {
    return this.refreshToken || sessionStorage.getItem('refreshToken');
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

  saveTokens(token: string, refreshToken: string) {
    if (!token) {
      console.error("Token manquant !");
      return;
    }

    const jwt = token.startsWith('Bearer') ? token.slice(7) : token;
    this.jwtToken = jwt;
    this.refreshToken = refreshToken;
    sessionStorage.setItem('token', jwt);
    if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken);

    let decoded: any;
    try {
      decoded = this.helper.decodeToken(jwt);
    } catch (err) {
      console.error("Impossible de décoder le token :", err);
      sessionStorage.removeItem('role');
      return;
    }

    // Maintenant roles est un simple string
    const role = decoded.role ? decoded.role.toUpperCase() : '';

    // Priorité sur role pour sessionStorage
    const rolePriority: { [key: string]: string } = {
      'ADMIN': 'ADMIN',
      'CLIENT_ADMIN': 'CLIENT_ADMIN',
      'CLIENT_COMPTABLE': 'CLIENT_COMPTABLE',
      'BAILLEUR': 'BAILLEUR',
      'COHORTE_COMPTABLE': 'COHORTE_COMPTABLE',
      'ENTREPRISE_USER': 'ENTREPRISE_USER',
    };
    sessionStorage.setItem('role', rolePriority[role] || '');
  }


  isAdmin() { return sessionStorage.getItem('role') === 'ADMIN'; }
  isClientAdmin() { return sessionStorage.getItem('role') === 'CLIENT_ADMIN'; }
  isClientComptable() { return sessionStorage.getItem('role') === 'CLIENT_COMPTABLE'; }
  isBailleur() { return sessionStorage.getItem('role') === 'BAILLEUR'; }
  isCohorteComptable() { return sessionStorage.getItem('role') === 'COHORTE_COMPTABLE'; }
  isEntrepriseUser() { return sessionStorage.getItem('role') === 'ENTREPRISE_USER'; }

  isComptable() { return sessionStorage.getItem('role') === 'ENTREPRISE_USER'; }

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
  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role ? payload.role.toUpperCase() : null;
  }


  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

}



