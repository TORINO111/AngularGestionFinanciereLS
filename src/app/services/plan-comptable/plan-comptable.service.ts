import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PlanComptable } from '../../models/plan-comptable.model';
import { PlanAnalytique } from '../../models/plan-analytique.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  
  //private host:string='http://localhost:8082';
  //private host:string='//4.222.22.46:8082/gest-fin';
  ///private host:string='http://localhost:8082';

  private baseUrlCompteComptable = `${environment.apiUrl}/api/compte-comptable`;
  private baseUrlPlanAnalytique = `${environment.apiUrl}/api/plan-analytique`;
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<PlanComptable[]> {
    return this.http.get<PlanComptable[]>(`${environment.apiUrl}/api/comptes-comptables`);
  }

  getAllParPrefixe(prefixe:string): Observable<PlanComptable[]> {
    const params = new HttpParams().set('prefixe', prefixe);
    return this.http.get<PlanComptable[]>(`${environment.apiUrl}/api/plans-comptables/par-prefixe`, { params });
  }

  create(tiers: PlanComptable): Observable<PlanComptable> {
    return this.http.post<PlanComptable>(this.baseUrlCompteComptable, tiers);
  }

  update(compte: string, tiers: PlanComptable): Observable<PlanComptable> {
    return this.http.put<PlanComptable>(`${this.baseUrlCompteComptable}/${compte}`, tiers);
  }

  delete(compte: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlCompteComptable}/${compte}`);
  }

  importerPlanComptable(formData: FormData) {
    return this.http.post<ImportPlanComptableResultDTO>(`${environment.apiUrl}/api/import-plan-comptable`,formData);
  }

  getAllPlanAnalytique(): Observable<PlanAnalytique[]> {
    return this.http.get<PlanAnalytique[]>(`${environment.apiUrl}/api/plans-analytiques`);
  }

  createPlanAnalytique(plananalytique: PlanAnalytique): Observable<PlanAnalytique> {
    return this.http.post<PlanAnalytique>(this.baseUrlPlanAnalytique, plananalytique);
  }

  updatePlanAnalytique(sectionAnalytique: string, plananalytique: PlanAnalytique): Observable<PlanAnalytique> {
    return this.http.put<PlanAnalytique>(`${this.baseUrlPlanAnalytique}/${sectionAnalytique}`, plananalytique);
  }

  deletePlanAnalytique(sectionAnalytique: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlPlanAnalytique}/${sectionAnalytique}`);
  }

  importerPlanAnalytique(formData: FormData) {
    return this.http.post<ImportPlanComptableResultDTO>(`${environment.apiUrl}/api/import-plan-analytique`,formData);
  }
}
