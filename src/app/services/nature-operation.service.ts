import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NatureOperation } from '../models/nature-operation.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class NatureOperationService {
  //private host:string='http://localhost:8082/gest-fin';
  //private host:string='//4.222.22.46:8082/gest-fin';
  private host:string='http://localhost:8082';

  constructor(private http: HttpClient) {}

  getAll(): Observable<NatureOperation[]> {
    return this.http.get<NatureOperation[]>(this.host+'/api/natures').pipe(
      catchError(this.handleError)
    );
  }

  getAllCodeJournal(): Observable<any[]> {
    return this.http.get<any[]>(this.host+'/api/codes-journals').pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<NatureOperation> {
    return this.http.get<NatureOperation>(this.host+'/api/nature'+`/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(data: NatureOperation): Observable<NatureOperation> {
    return this.http.post<NatureOperation>(this.host+'/api/nature', data).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, data: NatureOperation): Observable<NatureOperation> {
    return this.http.put<NatureOperation>(this.host+'/api/nature'+`/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.host+'/api/nature'+`/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getByFilters(
    societeId?: number,
    typeDepense?: string,
    typeCategorie?: string
  ): Observable<NatureOperation[]> {
    let params: any = {};
  
    if (societeId !== undefined) params.societeId = societeId.toString();
    if (typeDepense) params.typeDepense = typeDepense;
    if (typeCategorie) params.typeCategorie = typeCategorie;
  
    return this.http.get<NatureOperation[]>(`${this.host+'/api/nature/by-filters'}`, { params });
  }
  

  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.error?.message || 'Erreur serveur';
    console.error('Erreur NatureOperation:', msg);
    return throwError(() => new Error(msg));
  }

  
}
