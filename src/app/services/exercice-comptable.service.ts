import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciceComptable } from '../models/exercice-comptable.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciceComptableService {


  //private host:string='http://localhost:8082/gest-fin';
  //private host:string='//4.222.22.46:8082/gest-fin';
  private host:string='http://localhost:8082';

  constructor(private http: HttpClient) {}


  // ✅ Créer un nouvel exercice
  creerExercice(exercice: ExerciceComptable): Observable<ExerciceComptable> {
    return this.http.post<ExerciceComptable>(`${this.host}/api/exercice`, exercice);
  }

  getById(id: number): Observable<ExerciceComptable> {
    return this.http.get<ExerciceComptable>(`${this.host}/api/exercice/${id}`);
  }

  ouvrirExercice(annee: number): Observable<ExerciceComptable> {
    return this.http.post<ExerciceComptable>(`${this.host}/ouvrir`, { annee });
  }

  cloturerExercice(id: number): Observable<ExerciceComptable> {
    return this.http.put<ExerciceComptable>(`${this.host}/api/exercice/cloturer/${id}`, {});
  }

  findAllBySociete(societeId: number): Observable<ExerciceComptable[]> {
    return this.http.get<ExerciceComptable[]>(`${this.host}/api/exercices/societe/${societeId}`);
  }

  getExerciceEnCoursBySociete(societeId: number): Observable<ExerciceComptable> {
    return this.http.get<ExerciceComptable>(`${this.host}/api/exercice/exercice-en-cours/${societeId}`);
  }
  
  
}
