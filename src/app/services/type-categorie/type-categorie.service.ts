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
  private baseUrl = `${environment.apiUrl}/api/type-categories`;

  constructor(private http: HttpClient, private notification: NotificationService) {}

  getAll(): Observable<TypeCategorie[]> {
    return this.http.get<TypeCategorie[]>(this.baseUrl);
  }

  creerTypeCategorie(typeCategorie: any) : Observable<any>{
    return this.http.post(this.baseUrl,typeCategorie,{
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }
  
  modifierTypeCategorie(id:number,typeCategorie: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`,typeCategorie,{
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }

  chargerTypesCategorie(types:any, lastTypeId: number) {
    this.getAll().subscribe({
      next: (data: any[]) => {
        types = data.map(t => ({ id: t.id, code: t.code, libelle: t.libelle }));
        lastTypeId = data[data.length - 1].id;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des types', err);
        this.notification.showError("Erreur lors du chargement des types");
      }
    });
  }

}
