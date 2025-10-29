import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { CodeJournal } from 'src/app/models/code-journal.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodeJournalService {

  private apiUrl = `${environment.apiUrl}/api/journaux`;


  constructor(private http: HttpClient) { }

  getAll(page = 0, size = 10, libelle?: string, typeJournalId?: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (libelle) params = params.set('libelle', libelle);
    if (typeJournalId) params = params.set('typeJournalId', typeJournalId);

    return this.http.get<any>(`${this.apiUrl}/pageable`, { params });
  }

  getTypes() {
    return this.http.get<any[]>(`${environment.apiUrl}/api/type-journal/all`);
  }

  getById(id: number): Observable<CodeJournal> {
    return this.http.get<CodeJournal>(`${this.apiUrl}/${id}`);
  }

  create(request: any): Observable<CodeJournal> {
    return this.http.post<CodeJournal>(`${this.apiUrl}`, request);
  }

  update(id: number, request: any): Observable<CodeJournal> {
    return this.http.put<CodeJournal>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
