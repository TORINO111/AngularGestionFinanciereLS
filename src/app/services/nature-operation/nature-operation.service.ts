import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { NatureOperationDto } from '../../models/nature-operation.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NatureOperationService {
  //private host:string='http://localhost:8082/gest-fin';
  //private host:string='//4.222.22.46:8082/gest-fin';
  //private host:string='http://localhost:8082';

  private baseUrl = `${environment.apiUrl}/api/nature-mapping`;

  constructor(private http: HttpClient) {}

  getPrefixe(typeNature: string): Observable<string> {
    const params = new HttpParams().set('typeNature', typeNature);
    return this.http.get<string>(`${this.baseUrl}/prefixe`, { params });
  }

  // Récupérer la classe selon le TypeNature
  getClasse(typeNature: string): Observable<string> {
    const params = new HttpParams().set('typeNature', typeNature);
    return this.http.get<string>(`${this.baseUrl}/classe`, { params });
  }
  
  getAll(): Observable<NatureOperationDto[]> {
    return this.http.get<NatureOperationDto[]>(`${environment.apiUrl}/api/natures`).pipe(
      catchError(this.handleError)
    );
  }

  getAllPageable(
    page: number = 0,
    size: number = 20,
    searchCodeChamp?: string,
    searchCategorie?: number,
    searchJournal?: number,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (searchCodeChamp) params = params.set('searchCodeChamp', searchCodeChamp);
    if (searchCategorie) params = params.set('searchCategorie', searchCategorie);
    if (searchJournal) params = params.set('searchJournal', searchJournal);

    return this.http.get<any>(`${environment.apiUrl}/api/natures/pageable`).pipe(
      catchError(this.handleError)
    );
  }

  getAllCodeJournal(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/codes-journals`).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<NatureOperationDto> {
    return this.http.get<NatureOperationDto>(`${environment.apiUrl}/api/nature/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(data: NatureOperationDto): Observable<NatureOperationDto> {
    return this.http.post<NatureOperationDto>(`${environment.apiUrl}/api/nature`, data).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, data: NatureOperationDto): Observable<NatureOperationDto> {
    return this.http.put<NatureOperationDto>(`${environment.apiUrl}/api/nature/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${environment.apiUrl}/api/nature/${id}`).pipe(
        catchError(this.handleError)
      );
    }

  getByFilters(
    societeId?: number,
    typeDepense?: string,
    typeCategorie?: string
  ): Observable<NatureOperationDto[]> {
    let params: any = {};
  
    if (societeId !== undefined) params.societeId = societeId.toString();
    if (typeDepense) params.typeDepense = typeDepense;
    if (typeCategorie) params.typeCategorie = typeCategorie;
  
    return this.http.get<NatureOperationDto[]>(`${environment.apiUrl}/api/nature/by-filters`, { params });
  }
  

  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.error?.message || 'Erreur serveur';
    console.error('Erreur NatureOperation:', msg);
    return throwError(() => new Error(msg));
  }

  
}
