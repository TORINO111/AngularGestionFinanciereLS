
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
  private baseUrlSocietes = `${environment.apiUrl}/api/societes`;
  
  constructor(private http: HttpClient) {}

  getAllSociete(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.baseUrlSocietes);
  }

  getSocietesPourComptableConnecte(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.baseUrlSocietes);
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

  getAllCabinet(): Observable<Societe[]> {
    return this.http.get<Societe[]>(`${environment.apiUrl}/api/cabinet-comptables`);
  }

  createCabinet(societe: Societe): Observable<Societe> {
    return this.http.post<Societe>(`${environment.apiUrl}/api/cabinet-comptable`, societe);
  }

  updateCabinet(id: number, societe: Societe): Observable<Societe> {
    return this.http.put<Societe>(`${environment.apiUrl}/api/cabinet-comptable/${id}`, societe);
  }

  deleteCabinet(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/cabinet-comptable/${id}`);
  }
 
}

