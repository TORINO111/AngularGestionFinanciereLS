import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PlanComptable } from '../../models/plan-comptable.model';
import { PlanAnalytiqueDTO } from '../../models/plan-analytique.model';
import { Observable } from 'rxjs';

export interface PlanComptableImportDTO {
  ligne: number;
  compte: string;
  intitule: string;
  erreur: string;
}
export interface ImportComptesComptablesResultDTO {
  success: boolean;
  message: string;
  lignesImportees: number;
  erreurs: PlanComptableImportDTO[];
}
@Injectable({
  providedIn: 'root'
})
export class PlanComptableService {

  private baseUrlPlanComptables = `${environment.apiUrl}/api/planComptables`;
  private baseUrlPlanComptable = `${environment.apiUrl}/api/planComptable`;

  constructor(private http: HttpClient) { }


  getAll(): Observable<PlanComptable[]> {
    return this.http.get<PlanComptable[]>(this.baseUrlPlanComptables);
  }

  getAllPageable(
    page: number = 0,
    size: number = 20,
    search?: string,
  ): Observable<PlanComptable[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) params = params.set('search', search);

    return this.http.get<PlanComptable[]>(`${this.baseUrlPlanComptables}/pageable`);
  }

  getAllPlanAnalytiquePageable(
    page: number = 0,
    size: number = 20,
    search?: string,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (search) params = params.set('search', search);

    return this.http.get<any>(`${environment.apiUrl}/api/plans-analytiques/pageable`, { params });
  }


  getByTypeNature(typeNature: string) {
    const params = new HttpParams().set('typeNature', typeNature);
    return this.http.get<PlanComptable[]>(`${this.baseUrlPlanComptables}/par-typenature`, { params });
  }

  getAllParPrefixe(prefixe: string): Observable<PlanComptable[]> {
    const params = new HttpParams().set('prefixe', prefixe);
    return this.http.get<PlanComptable[]>(`${environment.apiUrl}/api/plans-comptables/par-prefixe`, { params });
  }

  create(plan: PlanComptable): Observable<PlanComptable> {
    return this.http.post<PlanComptable>(this.baseUrlPlanComptable, plan);
  }

  update(id: number, plan: PlanComptable): Observable<PlanComptable> {
    return this.http.put<PlanComptable>(`${this.baseUrlPlanComptable}/${id}`, plan);
  }

  delete(planComptableId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlPlanComptable}/delete/${planComptableId}`);
  }

  importerPlanComptable(formData: FormData) {
    return this.http.post<ImportComptesComptablesResultDTO>(`${environment.apiUrl}/api/import-plan-comptable`, formData);
  }

  getAllPlanAnalytique(): Observable<PlanAnalytiqueDTO[]> {
    return this.http.get<PlanAnalytiqueDTO[]>(`${environment.apiUrl}/api/plans-analytiques`);
  }

  importerPlanAnalytique(formData: FormData) {
    return this.http.post<ImportComptesComptablesResultDTO>(`${environment.apiUrl}/api/import-plan-analytique`, formData);
  }
}
