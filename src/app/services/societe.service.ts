
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Societe } from './../models/societe.model';
import { Pays } from '../models/pays.model';
@Injectable({
  providedIn: 'root'
})
export class SocieteService {
private host:string='http://localhost:8082';

  //private host:string='//4.222.22.46:8082/gest-fin';
  //private host:string='http://localhost:8082';

  constructor(private http: HttpClient) {}

  

  getAllSociete(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.host+'/api/societes');
  }

  getSocietesPourComptableConnecte(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.host+'/api/societes');
  }
  getAllPays(): Observable<Pays[]> {
    return this.http.get<Pays[]>(this.host+'/api/pays');
  }

  createSociete(societe: Societe): Observable<Societe> {
    return this.http.post<Societe>(this.host+'/api/societe', societe);
  }

  updateSociete(id: number, societe: Societe): Observable<Societe> {
    return this.http.put<Societe>(`${this.host+'/api/societe'}/${id}`, societe);
  }

  deleteSociete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.host+'/api/societe'}/${id}`);
  }

  getAllCabinet(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.host+'/api/cabinet-comptables');
  }
  

  createCabinet(societe: Societe): Observable<Societe> {
    return this.http.post<Societe>(this.host+'/api/cabinet-comptable', societe);
  }

  updateCabinet(id: number, societe: Societe): Observable<Societe> {
    return this.http.put<Societe>(`${this.host+'/api/cabinet-comptable'}/${id}`, societe);
  }

  deleteCabinet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.host+'/api/cabinet-comptable'}/${id}`);
  }
 
}

