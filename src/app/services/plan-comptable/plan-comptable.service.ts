import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PlanComptable } from '../../models/plan-comptable.model';
import { PlanAnalytique, PlanAnalytiqueDTO } from '../../models/plan-analytique.model';
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

  private baseUrlPlanComptables = `${environment.apiUrl}/api/planComptables`;
  private baseUrlPlanComptable = `${environment.apiUrl}/api/planComptable`;
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<PlanComptable[]> {
    return this.http.get<PlanComptable[]>(this.baseUrlPlanComptables);
  }

  getByTypeNature(typeNature: string) {
    const params = new HttpParams().set('typeNature', typeNature);
    return this.http.get<PlanComptable[]>(`${this.baseUrlPlanComptables}/par-typenature`, {params});
  }

  getAllParPrefixe(prefixe:string): Observable<PlanComptable[]> {
    const params = new HttpParams().set('prefixe', prefixe);
    return this.http.get<PlanComptable[]>(`${environment.apiUrl}/api/plans-comptables/par-prefixe`, { params });
  }

  create(plan: PlanComptable): Observable<PlanComptable> {
    return this.http.post<PlanComptable>(this.baseUrlPlanComptable, plan);
  }

  update(id: number, plan: PlanComptable): Observable<PlanComptable> {
    return this.http.put<PlanComptable>(`${this.baseUrlPlanComptable}/${id}`, plan);
  }

  delete(planComptableId: number, sectionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlPlanComptable}/${planComptableId}/${sectionId}`);
  }

  importerPlanComptable(formData: FormData) {
    return this.http.post<ImportPlanComptableResultDTO>(`${environment.apiUrl}/api/import-plan-comptable`,formData);
  }

  getAllPlanAnalytique(): Observable<PlanAnalytiqueDTO[]> {
    return this.http.get<PlanAnalytiqueDTO[]>(`${environment.apiUrl}/api/plans-analytiques`);
  }

  importerPlanAnalytique(formData: FormData) {
    return this.http.post<ImportPlanComptableResultDTO>(`${environment.apiUrl}/api/import-plan-analytique`,formData);
  }
}
