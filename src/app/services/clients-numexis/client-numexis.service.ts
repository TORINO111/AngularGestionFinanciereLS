import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClientNumexis } from '../../models/client-numexis.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientNumexisService {

  private baseUrl = `${environment.apiUrl}/api/clients-numexis`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ClientNumexis[]> {
    return this.http.get<ClientNumexis[]>(this.baseUrl);
  }

  getAllPageable(
    page: number = 0,
    size: number = 20,
    nom?: string,
    sigle?: string,
    telephone?: string,
    email?: string,
    adresse?: string,
    numeroRccm?: string,
    numeroIFU?: string,
    ville?: string,
    pays?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nom) params = params.set('nom', nom);
    if (sigle) params = params.set('sigle', sigle);
    if (telephone) params = params.set('telephone', telephone);
    if (email) params = params.set('email', email);
    if (adresse) params = params.set('adresse', adresse);
    if (numeroRccm) params = params.set('numeroRccm', numeroRccm);
    if (numeroIFU) params = params.set('numeroIFU', numeroIFU);
    if (ville) params = params.set('ville', ville);
    if (pays) params = params.set('pays', pays);

    return this.http.get<any>(`${this.baseUrl}/pageable`, { params });
  }

  create(clientNumexis: Partial<ClientNumexis>): Observable<ClientNumexis> {
    return this.http.post<ClientNumexis>(this.baseUrl, clientNumexis);
  }

  update(id: number, clientNumexis: Partial<ClientNumexis>): Observable<ClientNumexis> {
    return this.http.put<ClientNumexis>(`${this.baseUrl}/${id}`, clientNumexis);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
