
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Societe } from '../../models/societe.model';
import { Pays } from '../../models/pays.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SocieteService {

  private baseUrlSociete = `${environment.apiUrl}/api/societe`;

  constructor(private http: HttpClient) { }

  getAllSociete(): Observable<Societe[]> {
    return this.http.get<Societe[]>(`${this.baseUrlSociete}/all`);
  }

  getAllSocietePageable(
    page: number = 0,
    size: number = 10,
    nom?: string,
    tel?: string,
    ville?: string,
    pays?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (nom) params = params.set('nom', nom);
    if (tel) params = params.set('tel', tel);
    if (ville) params = params.set('ville', ville);
    if (pays) params = params.set('pays', pays);

    return this.http.get<any>(`${this.baseUrlSociete}/pageable`, { params });
  }


  getSocietePourUserConnecte(userId: number): Observable<Societe> {
    return this.http.get<Societe>(`${this.baseUrlSociete}/user/${userId}`);
  }

  getAllPays(): Observable<Pays[]> {
    return this.http.get<Pays[]>(`${environment.apiUrl}/api/pays`);
  }

  createSociete(societe: Societe): Observable<Societe> {
    return this.http.post<Societe>(this.baseUrlSociete, societe);
  }

  updateSociete(id: number, societe: Societe): Observable<Societe> {
    return this.http.put<Societe>(`${this.baseUrlSociete}/${id}`, societe);
  }

  deleteSociete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlSociete}/${id}`);
  }

}

