import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CategorieService {

 //private host:string='http://localhost:8082/gest-fin';
 //private host:string='//4.222.22.46:8082/gest-fin';
 //private host:string='http://localhost:8082';

  private baseUrlCategorie = `${environment.apiUrl}/api/categorie`;
 

 constructor(private _http: HttpClient) {}

  
creerCategorie(categorie: any) {
  return this._http.post(this.baseUrlCategorie,categorie,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
modifierCategorie(id:number,categorie: any) {
  return this._http.put(`${this.baseUrlCategorie}/${id}`,categorie,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

getAllCategories(): Observable<any> {
  return this._http.get(`${environment.apiUrl}/api/categories`,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
getCategorieParId(id:number) {
  return this._http.get(`${this.baseUrlCategorie}/${id}`,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

supprimerCategorie(id: number) {
  return this._http.delete(`${this.baseUrlCategorie}/${id}`,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

}
