import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeCategorie } from 'src/app/models/type-categorie.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TypeCategorieService {
  private baseUrl = `${environment.apiUrl}/api/type-categorie`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeCategorie[]> {
    return this.http.get<TypeCategorie[]>(this.baseUrl);
  }

  creerTypeCategorie(typeCategorie: any) : Observable<any>{
    return this.http.post(this.baseUrl,typeCategorie,{
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }
  
  modifierTypeCategorie(id:number,typeCategorie: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`,typeCategorie,{
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }

}
