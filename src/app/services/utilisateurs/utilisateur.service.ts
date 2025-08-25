import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

}
