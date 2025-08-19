import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PlanComptable } from '../models/plan-comptable.model';
import { PlanAnalytique } from '../models/plan-analytique.model';
import { Observable } from 'rxjs';
export interface PlanComptableImportDTO {
  ligne: number;
  compte: string;
  intitule: string;
  erreur: string;
}
export interface ImportPlanComptableResultDTO {
  success: boolean;
  message: string;
  lignesImportees: number;
  erreurs: PlanComptableImportDTO[];
}  
@Injectable({
  providedIn: 'root'
})
export class PlanComptableService {

  private host:string='http://localhost:8082';
  //private host:string='//4.222.22.46:8082/gest-fin';
  ///private host:string='http://localhost:8082';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PlanComptable[]> {
    return this.http.get<PlanComptable[]>(this.host+'/api/comptes-comptables');
  }

  getAllParPrefixe(prefixe:string): Observable<PlanComptable[]> {
    const params = new HttpParams().set('prefixe', prefixe);
    return this.http.get<PlanComptable[]>(this.host+'/api/plans-comptables/par-prefixe', { params });
  }

  create(tiers: PlanComptable): Observable<PlanComptable> {
    return this.http.post<PlanComptable>(this.host+'/api/compte-comptable', tiers);
  }

  update(compte: string, tiers: PlanComptable): Observable<PlanComptable> {
    return this.http.put<PlanComptable>(`${this.host+'/api/compte-comptable'}/${compte}`, tiers);
  }

  delete(compte: string): Observable<void> {
    return this.http.delete<void>(`${this.host+'/api/compte-comptable'}/${compte}`);
  }

  importerPlanComptable(formData: FormData) {
    return this.http.post<ImportPlanComptableResultDTO>(this.host+'/api/import-plan-comptable',formData);
  }

  getAllPlanAnalytique(): Observable<PlanAnalytique[]> {
    return this.http.get<PlanAnalytique[]>(this.host+'/api/plans-analytiques');
  }

  createPlanAnalytique(plananalytique: PlanAnalytique): Observable<PlanAnalytique> {
    return this.http.post<PlanAnalytique>(this.host+'/api/plan-analytique', plananalytique);
  }

  updatePlanAnalytique(sectionAnalytique: string, plananalytique: PlanAnalytique): Observable<PlanAnalytique> {
    return this.http.put<PlanAnalytique>(`${this.host+'/api/plan-analytique'}/${sectionAnalytique}`, plananalytique);
  }

  deletePlanAnalytique(sectionAnalytique: string): Observable<void> {
    return this.http.delete<void>(`${this.host+'/api/plan-analytique'}/${sectionAnalytique}`);
  }

  importerPlanAnalytique(formData: FormData) {
    return this.http.post<ImportPlanComptableResultDTO>(this.host+'/api/import-plan-analytique',formData);
  }
}
