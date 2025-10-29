import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Bailleur } from '../../models/bailleur.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BailleurService {

  private baseUrl = `${environment.apiUrl}/api/bailleurs`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Bailleur[]> {
    return this.http.get<Bailleur[]>(this.baseUrl);
  }

  getAllPageable(
    page: number = 0,
    size: number = 20,
    nom?: string,
    clientNumexisId?: number,
    clientNumexisNom?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nom) {
      params = params.set('nom', nom);
    }
    if (clientNumexisId) {
      params = params.set('clientNumexisId', clientNumexisId.toString());
    }
    if (clientNumexisNom) {
      params = params.set('clientNumexisNom', clientNumexisNom);
    }

    return this.http.get<any>(`${this.baseUrl}/pageable`, { params });
  }

  create(bailleur: Partial<Bailleur>): Observable<Bailleur> {
    return this.http.post<Bailleur>(this.baseUrl, bailleur);
  }

  update(id: number, bailleur: Partial<Bailleur>): Observable<Bailleur> {
    return this.http.put<Bailleur>(`${this.baseUrl}/${id}`, bailleur);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
