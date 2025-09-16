import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanAnalytique, PlanAnalytiqueDTO } from 'src/app/models/plan-analytique.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlansAnalytiquesService {
  private baseUrlPlanAnalytique = `${environment.apiUrl}/api/plan-analytique`;

  constructor(private http: HttpClient) { }

  createPlanAnalytique(plananalytique: PlanAnalytique): Observable<PlanAnalytique> {
    return this.http.post<PlanAnalytique>(this.baseUrlPlanAnalytique, plananalytique);
  }

  getAllPlanAnalytique(): Observable<PlanAnalytiqueDTO[]> {
    return this.http.get<PlanAnalytiqueDTO[]>(`${environment.apiUrl}/api/plans-analytiques`);
  }

  updatePlanAnalytique(plananalytiqueId: number, planAnalytique: PlanAnalytique): Observable<PlanAnalytique> {
    return this.http.put<PlanAnalytique>(`${this.baseUrlPlanAnalytique}/${plananalytiqueId}`, planAnalytique);
  }

  deleteSection(planId: number, sectionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlPlanAnalytique}/${planId}/section/${sectionId}`);
  }
}
