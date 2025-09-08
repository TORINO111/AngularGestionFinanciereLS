import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SectionAnalytique } from 'src/app/models/section-analytique';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SectionAnalytiqueService {
  private baseUrlSectionAnalytique = `${environment.apiUrl}/api/sections-analytiques`;

  constructor(private _http: HttpClient) { }

  creerSectionAnalytique(sectionAnalytique: any) {
    return this._http.post(this.baseUrlSectionAnalytique, sectionAnalytique, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  modifierSectionAnalytique(id: number, sectionAnalytique: SectionAnalytique) {
    return this._http.put(`${this.baseUrlSectionAnalytique}/${id}`, sectionAnalytique, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getAllSectionAnalytiques(): Observable<SectionAnalytique[]> {
    return this._http.get<SectionAnalytique[]>(this.baseUrlSectionAnalytique, {
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
