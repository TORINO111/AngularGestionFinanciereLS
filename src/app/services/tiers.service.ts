import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tiers } from '../models/tiers.model';
import { Observable } from 'rxjs';

export interface TiersImportDTO {
  ligne: number;
  compte: string;
  intitule: string;
  erreur: string;
}

export interface ImportTiersResultDTO {
  success: boolean;
  message: string;
  lignesImportees: number;
  erreurs: TiersImportDTO[];
} 

@Injectable({
  providedIn: 'root'
})
export class TiersService {
private host:string='http://localhost:8082';
  //private host:string='//4.222.22.46:8082/gest-fin';
  //private host:string='http://localhost:8082';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tiers[]> {
    return this.http.get<Tiers[]>(this.host+'/api/tiers');
  }

  create(tiers: Tiers): Observable<Tiers> {
    return this.http.post<Tiers>(this.host+'/api/tiers', tiers);
  }

  update(id: number, tiers: Tiers): Observable<Tiers> {
    return this.http.put<Tiers>(`${this.host+'/api/tiers'}/${id}`, tiers);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.host+'/api/tiers'}/${id}`);
  }

  getBySocieteAndType(societeId: number, type: string): Observable<Tiers[]> {
    const params = { societeId: societeId.toString(), type };
    return this.http.get<Tiers[]>(`${this.host+'/api/tiers-societe-type'}`, { params });
  }

  importerTiers(formData: FormData) {
    return this.http.post<ImportTiersResultDTO>(this.host+'/api/import-tiers',formData);
  }
  
}
