import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TresorerieService {
//private host:string='http://localhost:8082';
//private host:string='//4.222.22.46:8082/gest-fin';
///private host:string='http://localhost:8082';


constructor(private _http: HttpClient) {}

creerCategorie(categorie: any): Observable<any> {
    return this._http.post(`${environment.apiUrl}/api/categorie-tresorerie`, categorie, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  modifierCategorie(categorie: any): Observable<any> {
    return this._http.put(`${environment.apiUrl}/api/categorie-tresorerie`, categorie, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAllCategories(): Observable<any> {
    return this._http.get(`${environment.apiUrl}/api/categorie-tresoreries`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getCategorieParId(id: number): Observable<any> {
    return this._http.get(`${environment.apiUrl}/api/categorie-tresorerie/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  supprimerCategorie(id: number): Observable<any> {
    return this._http.delete(`${environment.apiUrl}/api/categorie-tresorerie/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  // Fonctions pour NatureOperation
  creerNatureOperation(natureoperation: any): Observable<any> {
    return this._http.post(`${environment.apiUrl}/api/nature-operation`, natureoperation, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  modifierNatureOperation(natureoperation: any, id: number): Observable<any> {
    return this._http.put(`${environment.apiUrl}/api/nature-operation/${id}`, natureoperation, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAllNatureOperations(): Observable<any> {
    return this._http.get(`${environment.apiUrl}/api/nature-operations`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getNatureOperationParId(id: number): Observable<any> {
    return this._http.get(`${environment.apiUrl}/api/nature-operation/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  supprimerNatureOperation(id: number): Observable<any> {
    return this._http.delete(`${environment.apiUrl}/api/nature-operation/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  // Fonctions pour Societe
  getSocieteParId(id: number): Observable<any> {
    return this._http.get(`${environment.apiUrl}/api/societe/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getSocietes(): Observable<any[]> {
    return this._http.get<any[]>(`${environment.apiUrl}/api/societes`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  // Fonctions pour Roles & Utilisateurs


  allSuperviseurs(): Observable<any[]> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this._http.get<any[]>(`${environment.apiUrl}/api/superviseurs`, { headers });
  }

  updateUtilisateurr(value: any): Observable<any> {
    return this._http.put(`${environment.apiUrl}/api/utilisateurr`, value, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  addData(data: any): Observable<any> {
    return this._http.post(`${environment.apiUrl}/api/donnees`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  addAdmin(id: number): Observable<any> {
    return this._http.get(`${environment.apiUrl}/api/add-admin/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  removeAdmin(id: number): Observable<any> {
    return this._http.get(`${environment.apiUrl}/api/remove-admin/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }


}
