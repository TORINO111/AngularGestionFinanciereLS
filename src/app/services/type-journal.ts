import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TypeJournal } from 'src/app/models/type-journal.model'; // Import the model

@Injectable({
  providedIn: 'root'
})
export class TypeJournalService {

  private baseUrl = `${environment.apiUrl}/api/type-journal`;

  constructor(private _http: HttpClient) { }

  create(typeJournal: TypeJournal): Observable<TypeJournal> {
    return this._http.post<TypeJournal>(this.baseUrl, typeJournal, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  update(id: number, typeJournal: TypeJournal): Observable<TypeJournal> {
    return this._http.put<TypeJournal>(`${this.baseUrl}/${id}`, typeJournal, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAll(): Observable<TypeJournal[]> {
    return this._http.get<TypeJournal[]>(`${this.baseUrl}/all`);
  }

  getAllPageable(
    page: number = 0,
    size: number = 20,
    search?: string
  ): Observable<any> { 
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) params = params.set('libelle', search);

    return this._http.get<any>(`${this.baseUrl}/pageable`, { params });
  }

  getById(id: number): Observable<TypeJournal> {
    return this._http.get<TypeJournal>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}