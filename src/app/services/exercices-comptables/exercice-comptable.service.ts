import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciceComptable } from '../../models/exercice-comptable.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExerciceComptableService {


  //private host:string='http://localhost:8082/gest-fin';
  //private host:string='//4.222.22.46:8082/gest-fin';
  //private host:string='http://localhost:8082';

  private baseUrlExercice = `${environment.apiUrl}/api/exercice`;
  

  constructor(private http: HttpClient) {}


  // ✅ Créer un nouvel exercice
  creerExercice(exercice: ExerciceComptable): Observable<ExerciceComptable> {
    return this.http.post<ExerciceComptable>(`${environment.apiUrl}/api/exercice`, exercice);
  }

  getById(id: number): Observable<ExerciceComptable> {
    return this.http.get<ExerciceComptable>(`${environment.apiUrl}/api/exercice/${id}`);
  }

  ouvrirExercice(annee: number): Observable<ExerciceComptable> {
    return this.http.post<ExerciceComptable>(`${environment.apiUrl}/ouvrir`, { annee });
  }

  cloturerExercice(id: number): Observable<ExerciceComptable> {
    return this.http.put<ExerciceComptable>(`${environment.apiUrl}/cloturer/${id}`, {});
  }

  findAllBySociete(societeId: number): Observable<ExerciceComptable[]> {
    return this.http.get<ExerciceComptable[]>(`${environment.apiUrl}/api/exercices/societe/${societeId}`);
  }

  getExerciceEnCoursBySociete(societeId: number): Observable<ExerciceComptable> {
    return this.http.get<ExerciceComptable>(`${environment.apiUrl}/api/exercice/exercice-en-cours/${societeId}`);
  }
  
  
}
