import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SectionAnalytique } from 'src/app/models/section-analytique';
import { SectionAnalytiqueDTO, SectionAnalytiqueRequest } from 'src/app/models/section-analytique.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SectionAnalytiqueService {

  private baseUrlSectionAnalytique = `${environment.apiUrl}/api/sections-analytiques`;

  constructor(private _http: HttpClient) { }

  creerSectionAnalytique(sectionAnalytique: SectionAnalytiqueRequest): Observable<SectionAnalytiqueDTO> {
    return this._http.post<SectionAnalytiqueDTO>(this.baseUrlSectionAnalytique, sectionAnalytique, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  modifierSectionAnalytique(id: number, sectionAnalytique: SectionAnalytiqueRequest): Observable<SectionAnalytiqueDTO> {
    return this._http.put<SectionAnalytiqueDTO>(`${this.baseUrlSectionAnalytique}/${id}`, sectionAnalytique, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAllSectionAnalytiques(): Observable<SectionAnalytiqueDTO[]> {
    return this._http.get<SectionAnalytiqueDTO[]>(this.baseUrlSectionAnalytique, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAllPageable(
    page: number = 0,
    size: number = 20,
    searchLibelle?: string,
    planId?: number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (searchLibelle) params = params.set('searchLibelle', searchLibelle);
    if (planId) params = params.set('planId', planId);

    return this._http.get<Observable<any>>(`${this.baseUrlSectionAnalytique}/pageable`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: params
    });
  }

  getSectionAnalytiqueParId(id: number) {
    return this._http.get(`${this.baseUrlSectionAnalytique}/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  supprimerSectionAnalytique(id: number) {
    return this._http.delete(`${this.baseUrlSectionAnalytique}/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
