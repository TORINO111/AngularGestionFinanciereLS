import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OperationDetailDTO } from '../../models/operation-detail.model';
import { Observable } from 'rxjs';
import { EcritureComptableDTO } from '../../models/ecriture-comptable.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EtatService {

  //private host:string='http://localhost:8082/gest-fin';
  //private host:string='//4.222.22.46:8082/gest-fin';
  //private host:string='http://localhost:8082';

  private baseUrlEtate = `${environment.apiUrl}/api/etat`;


  constructor(private http: HttpClient) {}

  getEtatOperations(type:string,societeId: number, from: string, to: string,codeJournal:string): Observable<OperationDetailDTO[]> {
    const params = new HttpParams()
      .set('type', type)
      .set('societeId', societeId)
      .set('codeJournal',codeJournal)
      .set('from', from)
      .set('to', to);

    return this.http.get<OperationDetailDTO[]>(`${this.baseUrlEtate}/recettes`, { params });
  }

  getECrituresComptables(societeId: number, from: string, to: string): Observable<EcritureComptableDTO[]> {
    const params = new HttpParams()
      .set('societeId', societeId)
      .set('from', from)
      .set('to', to);

    return this.http.get<EcritureComptableDTO[]>(`${environment.apiUrl}/api/ecritures-comptables`, { params });
  }

  exportEtatExcel(type:string,societeId: number, from: string, to: string,codeJournal:string) {
    const params = new HttpParams()
      .set('type', type)
      .set('societeId', societeId)
      .set('codeJournal',codeJournal)
      .set('from', from)
      .set('to', to);
    return this.http.get(`${this.baseUrlEtate}/excel/`, {params: params, responseType: 'blob' });
  }

  exportECrituresExcel(societeId: number, from: string, to: string) {
    const params = new HttpParams()
      .set('societeId', societeId)
      .set('from', from)
      .set('to', to);
    return this.http.get(`${environment.apiUrl}/api/ecritures-comptables/excel/`, {params: params, responseType: 'blob' });
  }

  exportEtatPDF(type:string,societeId: number, from: string, to: string,codeJournal:string) {
    const params = new HttpParams()
      .set('type', type)
      .set('societeId', societeId)
      .set('codeJournal',codeJournal)
      .set('from', from)
      .set('to', to);
    return this.http.get(`${this.baseUrlEtate}/pdf/`, {params: params, responseType: 'blob' });
  }
}
