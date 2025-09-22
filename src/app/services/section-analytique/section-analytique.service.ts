import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  creerSectionAnalytique(sectionAnalytique: SectionAnalytiqueRequest): Observable<SectionAnalytiqueDTO>  {
    return this._http.post<SectionAnalytiqueDTO>(this.baseUrlSectionAnalytique, sectionAnalytique, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  modifierSectionAnalytique(id: number, sectionAnalytique: SectionAnalytique): Observable<SectionAnalytiqueDTO> {
    return this._http.put<SectionAnalytiqueDTO>(`${this.baseUrlSectionAnalytique}/${id}`, sectionAnalytique, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAllSectionAnalytiques(): Observable<SectionAnalytiqueDTO[]> {
    return this._http.get<SectionAnalytiqueDTO[]>(this.baseUrlSectionAnalytique, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
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
