import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categorie } from 'src/app/models/categorie.model';
@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  //private host:string='http://localhost:8082/gest-fin';
  //private host:string='//4.222.22.46:8082/gest-fin';
  //private host:string='http://localhost:8082';

  private baseUrlCategorie = `${environment.apiUrl}/api/categorie`;


  constructor(private _http: HttpClient) { }


  creerCategorie(categorie: any) {
    return this._http.post(this.baseUrlCategorie, categorie, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  modifierCategorie(id: number, categorie: Categorie) {
    return this._http.put(`${this.baseUrlCategorie}/${id}`, categorie, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  // getAllCategories(): Observable<Categorie[]> {
  //   return this._http.get<Categorie[]>(`${environment.apiUrl}/api/categories`, {
  //     headers: new HttpHeaders().set('Content-Type', 'application/json')
  //   });
  // }

  getCategories(
    page: number = 0,
    size: number = 20,
    search?: string,
    type?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) params = params.set('search', search);
    if (type) params = params.set('type', type);

    return this._http.get<any>(`${environment.apiUrl}/api/categories/pageable`, { params });
  }



  getAllCategories(): Observable<Categorie[]> {
    return this._http.get<Categorie[]>(`${environment.apiUrl}/api/categories/all`);
  }


  getCategorieParId(id: number) {
    return this._http.get(`${this.baseUrlCategorie}/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  supprimerCategorie(id: number) {
    return this._http.delete(`${this.baseUrlCategorie}/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

}
