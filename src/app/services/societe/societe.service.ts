
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

