import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cohorte } from '../../models/cohorte.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CohorteService {

  private baseUrl = `${environment.apiUrl}/api/cohortes`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Cohorte[]> {
    return this.http.get<Cohorte[]>(this.baseUrl);
  }

  getAllPageable(
    page: number = 0,
    size: number = 20,
    nom?: string,
    bailleurId?: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nom) {
      params = params.set('nom', nom);
    }
    if (bailleurId) {
      params = params.set('bailleurId', bailleurId.toString());
    }

    return this.http.get<any>(`${this.baseUrl}/pageable`, { params });
  }

  create(cohorte: Partial<Cohorte>): Observable<Cohorte> {
    return this.http.post<Cohorte>(this.baseUrl, cohorte);
  }

  update(id: number, cohorte: Partial<Cohorte>): Observable<Cohorte> {
    return this.http.put<Cohorte>(`${this.baseUrl}/${id}`, cohorte);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
