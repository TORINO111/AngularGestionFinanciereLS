import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeCategorie } from 'src/app/models/type-categorie.model';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../notifications/notifications-service'

@Injectable({
  providedIn: 'root'
})
export class TypeCategorieService {
  private baseUrl = `${environment.apiUrl}/api/enums/type-categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeCategorie[]> {
    return this.http.get<TypeCategorie[]>(this.baseUrl);
  }

}
