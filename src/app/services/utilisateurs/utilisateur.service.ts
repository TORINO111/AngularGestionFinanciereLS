import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  //private host:string='http://localhost:8082';
  //private host:string='//4.222.22.46:8082/gest-fin';
  //private host:string='http://localhost:8082';

  constructor(private _http: HttpClient) {}

  allComptables(){
    let headers=new HttpHeaders().set('Accept','application/json');
    return this._http.get(`${environment.apiUrl}/api/comptables`,{headers:headers});
  }

  getAllPageable(
    page: number = 0,
    size: number = 20,
    telephone?: string,
    nom?: string,
    prenom?: string,
    role?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (telephone) params = params.set('telephone', telephone);
    if (nom) params = params.set('nom', nom);
    if (prenom) params = params.set('prenom', prenom);
    if (role) params = params.set('role', role);

    return this._http.get<any>(`${environment.apiUrl}/utilisateurs/pageable`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: params
    });
  }
}
