import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { OperationDto } from '../../models/operation.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Page } from 'ngx-pagination';
@Injectable({
  providedIn: 'root'
})
export class NatureOperationService {

  //private host:string='http://localhost:8082/gest-fin';
  //private host:string='//4.222.22.46:8082/gest-fin';
  //private host:string='http://localhost:8082';

  private baseUrl = `${environment.apiUrl}/api/operations`;

  constructor(private http: HttpClient) { }

  // getPrefixe(typeNature: string): Observable<string> {
  //   const params = new HttpParams().set('typeNature', typeNature);
  //   return this.http.get<string>(`${this.baseUrl}/prefixe`, { params });
  // }

  // // Récupérer la classe selon le TypeNature
  // getClasse(typeNature: string): Observable<string> {
  //   const params = new HttpParams().set('typeNature', typeNature);
  //   return this.http.get<string>(`${this.baseUrl}/classe`, { params });
  // }

  getAll(): Observable<OperationDto[]> {
    return this.http.get<OperationDto[]>(`${this.baseUrl}/findAll`).pipe(
      catchError(this.handleError)
    );
  }

  getByFilters(
    page: number,
    size: number,
    codeJournalId?: number,
    categorieId?: number,
    tiersId?: number,
    libelle?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (codeJournalId) params = params.set('codeJournalId', codeJournalId.toString());
    if (categorieId) params = params.set('categorieId', categorieId.toString());
    if (tiersId) params = params.set('tiersId', tiersId.toString());
    if (libelle) params = params.set('libelle', libelle);

    return this.http.get<any>(`${this.baseUrl}/by-filters`, { params });
  }

  getAllCodeJournal(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/code-journal/all`).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<OperationDto> {
    return this.http.get<OperationDto>(`${this.baseUrl}/update/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(data: OperationDto): Observable<OperationDto> {
    return this.http.post<OperationDto>(`${this.baseUrl}/create`, data).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, data: OperationDto): Observable<OperationDto> {
    return this.http.put<OperationDto>(`${this.baseUrl}/update/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.error?.message || 'Erreur serveur';
    console.error('Erreur NatureOperation:', msg);
    return throwError(() => new Error(msg));
  }


}
