import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ImportOperationResultDTO, Operation } from '../../models/operationRevoke.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

 

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  //private host:string='http://localhost:8082/gest-fin';
  //private host:string='//4.222.22.46:8082/gest-fin';
  //private host:string='http://localhost:8082';

  private baseUrlOperations = `${environment.apiUrl}/api/operations`;
  private baseUrlOperation = `${environment.apiUrl}/api/operation`;
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<Operation[]> {
    return this.http.get<Operation[]>(this.baseUrlOperations).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Operation> {
    return this.http.get<Operation>(`${this.baseUrlOperation}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(data: Operation): Observable<Operation> {
    return this.http.post<Operation>(this.baseUrlOperation, data).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, data: Operation): Observable<Operation> {
    return this.http.put<Operation>(`${this.baseUrlOperation}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlOperation}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getByFilters(
    societeId?: number,
    typeDepense?: string,
    typeCategorie?: string
  ): Observable<Operation[]> {
    let params: any = {};
  
    if (societeId !== undefined) params.societeId = societeId.toString();
    if (typeDepense) params.typeDepense = typeDepense;
    if (typeCategorie) params.typeCategorie = typeCategorie;
  
    return this.http.get<Operation[]>(`${environment.apiUrl}/api/operations/search`, { params });
  }

  importerOperations(formData: FormData) {
    return this.http.post<ImportOperationResultDTO>(`${environment.apiUrl}/api/import-operations`,formData);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.error?.message || 'Erreur serveur';
    console.error('Erreur Operation:', msg);
    return throwError(() => new Error(msg));
  }
}