import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Salarie } from '../models/salarie.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SalarieService {

  private baseUrl = 'http://localhost:8082/api/salaries';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Salarie[]> {
    return this.http.get<Salarie[]>(this.baseUrl);
  }

  create(salarie: Salarie): Observable<Salarie> {
    return this.http.post<Salarie>(this.baseUrl, salarie);
  }

  update(id: number, salarie: Salarie): Observable<Salarie> {
    return this.http.put<Salarie>(`${this.baseUrl}/${id}`, salarie);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
