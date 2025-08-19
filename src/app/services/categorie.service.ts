import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders,HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CategorieService {

 //private host:string='http://localhost:8082/gest-fin';
 //private host:string='//4.222.22.46:8082/gest-fin';
 private host:string='http://localhost:8082';

 constructor(private _http: HttpClient) {}

  
creerCategorie(categorie: any) {
  return this._http.post(this.host+'/api/categorie',categorie,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
modifierCategorie(id:number,categorie: any) {
  return this._http.put(this.host+'/api/categorie/'+id,categorie,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

getAllCategories(): Observable<any> {
  return this._http.get(this.host+'/api/categories',{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}
getCategorieParId(id:number) {
  return this._http.get(this.host+'/api/categorie/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

supprimerCategorie(id: number) {
  return this._http.delete(this.host+'/api/categorie/'+id,{
    headers:new HttpHeaders().set('Content-Type','application/json')
  });
}

}
