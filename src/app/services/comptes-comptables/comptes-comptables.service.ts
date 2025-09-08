import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompteComptableDTO } from 'src/app/models/compte-comptable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompteComptableService {
  private apiCompteUrl = `${environment.apiUrl}/api/compte`;
  private apiComptesUrl = `${environment.apiUrl}/api/comptes`;
  
  constructor(private http: HttpClient) {}

  getAll(): Observable<CompteComptableDTO[]> {
    return this.http.get<CompteComptableDTO[]>(`${this.apiComptesUrl}`);
  }

  create(compte: CompteComptableDTO): Observable<CompteComptableDTO> {
    return this.http.post<CompteComptableDTO>(this.apiCompteUrl, compte);
  }

  update(id: number, compte: CompteComptableDTO): Observable<CompteComptableDTO> {
    return this.http.put<CompteComptableDTO>(`${this.apiCompteUrl}/${id}`, compte);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiCompteUrl}/${id}`);
  }
}
